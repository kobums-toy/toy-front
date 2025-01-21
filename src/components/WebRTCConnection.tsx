import React, { useRef, useState, useEffect } from "react"

const WebRTCConnection: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000/p2p/webrtc?peer_id=client1")
    ws.onopen = () => console.log("WebSocket 연결 성공")
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data)
      if (message.type === "answer") {
        console.log("Received SDP Answer:", message.data)
        await peerConnection?.setRemoteDescription({
          type: "answer",
          sdp: message.data,
        })
      } else if (message.type === "candidate") {
        console.log("Received ICE Candidate:", message.data)
        await peerConnection?.addIceCandidate(new RTCIceCandidate(message.data))
      }
    }
    setWebSocket(ws)

    return () => ws.close()
  }, [peerConnection])

  const startConnection = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && webSocket) {
        webSocket.send(
          JSON.stringify({
            type: "candidate",
            data: event.candidate,
          })
        )
      }
    }

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    webSocket?.send(
      JSON.stringify({
        type: "offer",
        data: offer.sdp,
      })
    )

    setPeerConnection(pc)
  }

  return (
    <div>
      <h2>WebRTC P2P 연결</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "45%", margin: "10px" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: "45%", margin: "10px" }}
      />
      <button onClick={startConnection}>Start Connection</button>
    </div>
  )
}

export default WebRTCConnection
