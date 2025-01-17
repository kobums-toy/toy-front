import React, { useEffect, useRef, useState } from "react"

const Broadcast: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)

  let reconnectAttempts = 0
  const maxReconnectAttempts = 5

  useEffect(() => {
    connectWebSocket()
    return () => webSocket?.close()
  }, [])

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:9000/p2p/ws?role=broadcaster")

    ws.onopen = () => {
      console.log("송출자 WebSocket 연결 성공")
      ws.send(
        JSON.stringify({
          type: "candidate",
          data: {
            candidate: "candidate:1234",
            sdpMid: "0",
            sdpMLineIndex: 0,
          },
        })
      )
      reconnectAttempts = 0 // 재연결 카운터 초기화
    }

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data)
      console.log("송출자 WebSocket 메시지 수신:", message)

      if (message.type === "offer_request") {
        console.log("서버로부터 Offer 요청 수신")
        if (peerConnection) {
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)

          console.log("SDP Offer 생성:", offer.sdp)
          ws.send(
            JSON.stringify({
              type: "offer",
              data: offer.sdp,
            })
          )
        }
      }
    }

    ws.onclose = (event) => {
      console.log(`WebSocket 연결 종료: ${event.code}, ${event.reason}`)
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        console.log(
          `WebSocket 재연결 시도 (${reconnectAttempts}/${maxReconnectAttempts})...`
        )
        setTimeout(connectWebSocket, 1000 * reconnectAttempts) // 지수 백오프 방식
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error)
    }

    setWebSocket(ws)
  }

  const startBroadcast = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          username: "webrtc@live.com",
          credential: "muazkh",
        },
      ],
    })
    console.log("RTCPeerConnection 생성 성공:", pc)

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    console.log("로컬 스트림 가져오기 성공:", localStream)

    localStream.getTracks().forEach((track) => {
      console.log("Broadcaster 트랙 추가:", track.kind, track)
      pc.addTrack(track, localStream)
    })

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
      console.log("Broadcaster 로컬 비디오 설정 완료")
    }
    console.log("pc: ", pc)

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Broadcaster ICE Candidate 생성:", event.candidate)

        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(
            JSON.stringify({
              type: "candidate",
              data: event.candidate,
            })
          )
        } else {
          console.log(
            "WebSocket 연결이 닫혀 있어 ICE Candidate를 전송할 수 없습니다."
          )
        }
      } else {
        console.log("Broadcaster ICE Candidate 생성 완료 (null candidate)")
      }
    }

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => console.error("Offer 생성 실패:", err))

    pc.onconnectionstatechange = () => {
      console.log("RTCPeerConnection 상태:", pc.connectionState)
    }

    pc.onicegatheringstatechange = () => {
      console.log("ICE Gathering 상태:", pc.iceGatheringState)
    }

    setPeerConnection(pc)
  }

  return (
    <div>
      <h2>Broadcast</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", backgroundColor: "black" }}
      />
      <button onClick={startBroadcast}>Start Broadcast</button>
    </div>
  )
}

export default Broadcast
