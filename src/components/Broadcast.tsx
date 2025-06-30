import React, { useEffect, useRef, useState } from "react"

const Broadcast: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [connectionState, setConnectionState] = useState<string>("disconnected")

  let reconnectAttempts = 0
  const maxReconnectAttempts = 5

  const startBroadcast = async () => {
    try {
      console.log("🚀 방송 시작...")

      const pendingCandidates: RTCIceCandidate[] = []
      const ws = new WebSocket("ws://localhost:9000/p2p/ws?role=broadcaster")

      ws.onopen = async () => {
        console.log("✅ 송출자 WebSocket 연결 성공")

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:numb.viagenie.ca",
              username: "webrtc@live.com",
              credential: "muazkh",
            },
          ],
        })

        // 연결 상태 모니터링
        pc.onconnectionstatechange = () => {
          console.log("🔗 Broadcaster 연결 상태:", pc.connectionState)
          setConnectionState(pc.connectionState)
        }

        pc.oniceconnectionstatechange = () => {
          console.log("❄️ Broadcaster ICE 연결 상태:", pc.iceConnectionState)
        }

        console.log("✅ RTCPeerConnection 생성 완료")

        // 미디어 스트림 가져오기
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        })

        console.log("🎥 로컬 스트림 획득:", localStream.id)
        console.log(
          "📊 스트림 트랙:",
          localStream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
          }))
        )

        // 트랙 추가
        localStream.getTracks().forEach((track) => {
          console.log(`➕ ${track.kind} 트랙 추가:`, track.id)
          pc.addTrack(track, localStream)
        })

        // 로컬 비디오 설정
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
          console.log("✅ 로컬 비디오 엘리먼트 설정 완료")
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("❄️ Broadcaster ICE Candidate:", event.candidate.type)
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: "candidate",
                  data: event.candidate,
                })
              )
            } else {
              pendingCandidates.push(event.candidate)
            }
          } else {
            console.log("✅ Broadcaster ICE 수집 완료")
          }
        }

        pc.onicegatheringstatechange = () => {
          console.log("🔄 ICE Gathering 상태:", pc.iceGatheringState)
        }

        // 초기 Offer 생성
        const offer = await pc.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
        })
        await pc.setLocalDescription(offer)
        console.log("✅ 초기 Offer 생성 및 Local Description 설정")

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "offer",
              data: offer.sdp,
            })
          )
          console.log("📤 초기 Offer 전송 완료")
        }

        reconnectAttempts = 0
        setIsStreaming(true)

        // 대기 중인 ICE candidate 전송
        pendingCandidates.forEach((candidate) => {
          ws.send(JSON.stringify({ type: "candidate", data: candidate }))
        })
        pendingCandidates.length = 0

        setPeerConnection(pc)
        setWebSocket(ws)

        // 메시지 핸들러
        ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("📨 송출자 메시지 수신:", message.type)

            if (message.type === "offer_request") {
              console.log("🔔 새로운 Offer 요청 수신")
              const newOffer = await pc.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
              })
              await pc.setLocalDescription(newOffer)
              ws.send(
                JSON.stringify({
                  type: "offer",
                  data: newOffer.sdp,
                })
              )
              console.log("📤 새 Offer 전송 완료")
            }

            if (message.type === "answer") {
              console.log("🔔 Answer 수신")
              await pc.setRemoteDescription({
                type: "answer",
                sdp: message.data,
              })
              console.log("✅ Remote Description 설정 완료")
            }

            // ICE Candidate 처리 추가
            if (message.type === "candidate") {
              console.log("❄️ ICE Candidate 수신:", message.data.type)
              await pc.addIceCandidate(new RTCIceCandidate(message.data))
              console.log("✅ ICE Candidate 추가 완료")
            }
          } catch (error) {
            console.error("❌ 메시지 처리 오류:", error)
          }
        }
      }

      ws.onclose = (event) => {
        console.log(`❌ WebSocket 연결 종료: ${event.code}, ${event.reason}`)
        setIsStreaming(false)
        setConnectionState("disconnected")

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          console.log(
            `🔄 재연결 시도 (${reconnectAttempts}/${maxReconnectAttempts})...`
          )
          setTimeout(() => {
            startBroadcast()
          }, 1000 * reconnectAttempts)
        }
      }

      ws.onerror = (error) => {
        console.error("❌ WebSocket 오류:", error)
      }
    } catch (error) {
      console.error("❌ 방송 시작 오류:", error)
      setIsStreaming(false)
    }
  }

  const stopBroadcast = () => {
    console.log("⏹️ 방송 중지")

    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    if (webSocket) {
      webSocket.close()
      setWebSocket(null)
    }

    // 로컬 스트림 중지
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      localVideoRef.current.srcObject = null
    }

    setIsStreaming(false)
    setConnectionState("disconnected")
  }

  return (
    <div>
      <h2>Broadcast</h2>
      <div style={{ marginBottom: "10px" }}>
        <strong>방송 상태:</strong> {isStreaming ? "ON" : "OFF"} |
        <strong> 연결 상태:</strong> {connectionState}
      </div>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          backgroundColor: "black",
          minHeight: "300px",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={startBroadcast}
          disabled={isStreaming}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: isStreaming ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {isStreaming ? "방송 중..." : "방송 시작"}
        </button>
        <button
          onClick={stopBroadcast}
          disabled={!isStreaming}
          style={{
            padding: "10px 20px",
            backgroundColor: !isStreaming ? "#ccc" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          방송 중지
        </button>
      </div>
    </div>
  )
}

export default Broadcast
