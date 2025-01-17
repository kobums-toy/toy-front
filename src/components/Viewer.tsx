import React, { useEffect, useRef, useState } from "react"

const Viewer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000/p2p/ws?role=viewer")

    ws.onopen = () => {
      console.log("Viewer WebSocket 연결 성공")
      ws.send(JSON.stringify({ type: "request_stream" }))
    }

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data)
      console.log("Viewer WebSocket 메시지 수신:", message)

      if (message.type === "offer") {
        console.log("수신된 SDP Offer:", message.data)

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
        })

        pc.ontrack = (event) => {
          console.log("Viewer 원격 트랙 수신:", event.streams[0])
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
            console.log(
              "Viewer 원격 비디오 설정 완료:",
              remoteVideoRef.current.srcObject
            )
          } else {
            console.error("Viewer: remoteVideoRef.current가 비어 있습니다.")
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Viewer ICE Candidate 생성:", event.candidate)
            ws.send(
              JSON.stringify({
                type: "candidate",
                data: event.candidate,
              })
            )
          } else {
            console.log("Viewer ICE Candidate 생성 완료 (null candidate)")
          }
        }

        setPeerConnection(pc)

        await pc.setRemoteDescription({
          type: "offer",
          sdp: message.data,
        })

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        console.log("SDP Answer 생성:", answer.sdp)
        ws.send(
          JSON.stringify({
            type: "answer",
            data: answer.sdp,
          })
        )
      }
    }

    ws.onclose = () => {
      console.log("Viewer WebSocket 연결 종료")
    }

    setWebSocket(ws)

    return () => ws.close()
  }, [])

  return (
    <div>
      <h2>Viewer</h2>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", backgroundColor: "black" }}
      />
    </div>
  )
}

export default Viewer
