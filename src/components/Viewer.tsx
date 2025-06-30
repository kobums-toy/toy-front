import React, { useEffect, useRef, useState } from "react"

const Viewer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [connectionState, setConnectionState] = useState<string>("disconnected")

  useEffect(() => {
    const ws = new WebSocket(
      "ws://localhost:9000/p2p/ws?role=viewer&peer_id=viewer123"
    )

    ws.onopen = () => {
      console.log("✅ Viewer WebSocket 연결 성공")
      // 연결 후 잠시 대기 후 스트림 요청
      setTimeout(() => {
        ws.send(JSON.stringify({ type: "request_stream" }))
      }, 1000)
    }

    let pc: RTCPeerConnection | null = null

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("📨 Viewer WebSocket 메시지 수신:", message)

        if (message.type === "offer") {
          console.log("🔔 SDP Offer 수신")

          pc = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject",
              },
            ],
          })

          // 연결 상태 모니터링
          pc.onconnectionstatechange = () => {
            console.log("🔗 Viewer 연결 상태:", pc?.connectionState)
            setConnectionState(pc?.connectionState || "disconnected")
          }

          pc.oniceconnectionstatechange = () => {
            console.log("❄️ Viewer ICE 연결 상태:", pc?.iceConnectionState)
          }

          pc.ontrack = (event) => {
            console.log("📡 Viewer: ontrack 이벤트 수신")
            console.log("트랙 정보:", event.track.kind, event.track.readyState)

            const [stream] = event.streams
            if (stream && remoteVideoRef.current) {
              console.log("🎥 스트림을 video 엘리먼트에 연결:", stream.id)
              remoteVideoRef.current.srcObject = stream

              // 비디오 메타데이터 로드 대기
              remoteVideoRef.current.onloadedmetadata = () => {
                console.log(
                  "📐 비디오 메타데이터 로드됨:",
                  remoteVideoRef.current?.videoWidth,
                  "x",
                  remoteVideoRef.current?.videoHeight
                )
              }
            } else {
              console.error("⚠️ 스트림 또는 video ref 없음")
            }
          }

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              console.log("❄️ Viewer ICE Candidate 전송:", event.candidate.type)
              ws.send(
                JSON.stringify({
                  type: "candidate",
                  data: event.candidate,
                })
              )
            } else {
              console.log("✅ Viewer ICE 수집 완료")
            }
          }

          setPeerConnection(pc)

          // Remote Description 설정
          await pc.setRemoteDescription({
            type: "offer",
            sdp: message.data,
          })
          console.log("✅ Remote Description 설정 완료")

          // Answer 생성 및 전송
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          console.log("✅ Local Description 설정 완료")

          ws.send(
            JSON.stringify({
              type: "answer",
              data: answer.sdp,
            })
          )
          console.log("📤 SDP Answer 전송 완료")
        }

        // ICE Candidate 처리 추가
        if (message.type === "candidate" && pc) {
          console.log("❄️ ICE Candidate 수신:", message.data.type)
          await pc.addIceCandidate(new RTCIceCandidate(message.data))
          console.log("✅ ICE Candidate 추가 완료")
        }
      } catch (error) {
        console.error("❌ 메시지 처리 오류:", error)
      }
    }

    ws.onclose = (event) => {
      console.log("❌ Viewer WebSocket 연결 종료:", event.code, event.reason)
      setConnectionState("disconnected")
    }

    ws.onerror = (error) => {
      console.error("❌ Viewer WebSocket 오류:", error)
    }

    setWebSocket(ws)

    return () => {
      pc?.close()
      ws.close()
    }
  }, [])

  // 디버깅용 상태 모니터링
  useEffect(() => {
    const interval = setInterval(() => {
      if (remoteVideoRef.current) {
        const video = remoteVideoRef.current
        console.log("📊 Video 상태:", {
          width: video.videoWidth,
          height: video.videoHeight,
          paused: video.paused,
          currentTime: video.currentTime,
          readyState: video.readyState,
        })
      }
    }, 5000) // 5초마다 체크

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2>Viewer</h2>
      <div style={{ marginBottom: "10px" }}>
        <strong>연결 상태:</strong> {connectionState}
      </div>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted
        controls // 디버깅을 위해 컨트롤 추가
        style={{
          width: "100%",
          backgroundColor: "black",
          minHeight: "300px",
        }}
      />
    </div>
  )
}

export default Viewer
