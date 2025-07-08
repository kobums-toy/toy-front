/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, { useRef, useState, useEffect } from "react"
import { useRecoilValue } from "recoil"
import { userInfoState } from "../recoil/atoms" // 경로는 실제 구조에 맞게 수정

// 메인 컨테이너 스타일
const containerStyle = css`
  padding: 20px;
`

// 제목 스타일
const titleStyle = css`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`

// 방송 정보 카드 스타일
const infoCardStyle = css`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
`

// 방송 정보 행 스타일
const infoRowStyle = css`
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`

// 라벨 스타일
const labelStyle = css`
  font-weight: bold;
  margin-right: 8px;
`

// 방송 상태 스타일
const statusStyle = (isStreaming: boolean) => css`
  color: ${isStreaming ? "#28a745" : "#6c757d"};
  font-weight: bold;
  margin-left: 8px;
`

// 시청자 수 스타일
const viewerCountStyle = css`
  color: #007bff;
  font-weight: bold;
  margin-left: 8px;
`

// 비디오 스타일
const videoStyle = (isStreaming: boolean) => css`
  width: 100%;
  background-color: black;
  min-height: 400px;
  border-radius: 8px;
  border: ${isStreaming ? "3px solid #dc3545" : "1px solid #dee2e6"};
`

// 버튼 컨테이너 스타일
const buttonContainerStyle = css`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`

// 버튼 스타일
const buttonStyle = (disabled: boolean, variant: "primary" | "danger") => css`
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  transition: all 0.2s;
  background-color: ${disabled 
    ? "#6c757d" 
    : variant === "primary" 
      ? "#28a745" 
      : "#dc3545"};
`

export const Broadcast: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [connectionState, setConnectionState] = useState<string>("disconnected")
  const [viewerCount, setViewerCount] = useState<number>(0)
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0)
  const isManualStopRef = useRef<boolean>(false)

  // 사용자 인증 정보 가져오기
  const user = useRecoilValue(userInfoState)

  // 사용자 ID 추출 및 문자열로 변환 보장
  const userId = String(user?.id || user.id || "unknown")
  const userName = user.name || `사용자_${userId}`

  console.log("🔍 Broadcast 사용자 정보:", { userId, userName, user })

  const maxReconnectAttempts = 5

  const startBroadcast = async () => {
    try {
      console.log("🚀 방송 시작...", { userId, userName })
      isManualStopRef.current = false // ref도 리셋

      const pendingCandidates: RTCIceCandidate[] = []
      // 사용자 ID를 포함한 WebSocket 연결 (모든 파라미터를 문자열로 인코딩)
      const ws = new WebSocket(
        `ws://localhost:9000/p2p/ws?role=broadcaster&user_id=${encodeURIComponent(
          userId
        )}&user_name=${encodeURIComponent(userName)}`
      )

      ws.onopen = async () => {
        console.log("✅ 송출자 WebSocket 연결 성공")

        // 방송 시작 알림 전송 (모든 ID를 문자열로 보장)
        ws.send(
          JSON.stringify({
            type: "start_broadcast",
            broadcaster_id: userId, // 이미 문자열로 변환됨
            broadcaster_name: userName,
            timestamp: new Date().toISOString(),
          })
        )

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
                  broadcaster_id: userId, // 문자열로 보장
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
              broadcaster_id: userId, // 문자열로 보장
            })
          )
          console.log("📤 초기 Offer 전송 완료")
        }

        setReconnectAttempts(0)
        setIsStreaming(true)

        // 대기 중인 ICE candidate 전송
        pendingCandidates.forEach((candidate) => {
          ws.send(
            JSON.stringify({
              type: "candidate",
              data: candidate,
              broadcaster_id: userId, // 문자열로 보장
            })
          )
        })
        pendingCandidates.length = 0

        setPeerConnection(pc)
        setWebSocket(ws)

        // 메시지 핸들러
        ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("📨 송출자 메시지 수신:", message.type, message)

            if (message.type === "offer_request") {
              console.log(
                "🔔 새로운 Offer 요청 수신 from viewer:",
                message.viewer_id
              )
              const newOffer = await pc.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
              })
              await pc.setLocalDescription(newOffer)
              ws.send(
                JSON.stringify({
                  type: "offer",
                  data: newOffer.sdp,
                  broadcaster_id: userId, // 문자열로 보장
                  viewer_id: String(message.viewer_id), // 문자열로 변환
                })
              )
              console.log("📤 새 Offer 전송 완료")
            }

            if (message.type === "answer") {
              console.log("🔔 Answer 수신 from viewer:", message.viewer_id)
              await pc.setRemoteDescription({
                type: "answer",
                sdp: message.data,
              })
              console.log("✅ Remote Description 설정 완료")
            }

            if (message.type === "candidate") {
              console.log("❄️ ICE Candidate 수신:", message.data.type)
              await pc.addIceCandidate(new RTCIceCandidate(message.data))
              console.log("✅ ICE Candidate 추가 완료")
            }

            // 시청자 수 업데이트
            if (message.type === "viewer_count_update") {
              setViewerCount(message.count)
              console.log("👥 시청자 수 업데이트:", message.count)
            }
          } catch (error) {
            console.error("❌ 메시지 처리 오류:", error)
          }
        }
      }

      ws.onclose = (event) => {
        setIsStreaming(false)
        setConnectionState("disconnected")

        // 현재 isManualStop 상태를 확인하여 재연결 방지
        console.log("🔍 현재 isManualStop 상태:", isManualStopRef.current)

        // 사용자가 의도적으로 중지한 경우가 아닐 때만 재연결 시도
        if (
          !isManualStopRef.current &&
          reconnectAttempts < maxReconnectAttempts
        ) {
          const newAttempts = reconnectAttempts + 1
          setReconnectAttempts(newAttempts)
          console.log(
            `🔄 재연결 시도 (${newAttempts}/${maxReconnectAttempts})...`
          )
          setTimeout(() => {
            startBroadcast()
          }, 1000 * newAttempts)
        } else {
          console.log("🛑 방송이 완전히 중지되었습니다. 재연결하지 않습니다.")
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
    isManualStopRef.current = true // ref도 즉시 업데이트
    console.log(
      "stopBroadcast에서 isManualStopRef.current:",
      isManualStopRef.current
    )
    setReconnectAttempts(0) // 재연결 시도 횟수 초기화

    // 방송 종료 알림
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(
        JSON.stringify({
          type: "stop_broadcast",
          broadcaster_id: userId, // 문자열로 보장
          timestamp: new Date().toISOString(),
        })
      )
    }

    // 로컬 스트림 먼저 중지
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      localVideoRef.current.srcObject = null
    }

    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    if (webSocket) {
      webSocket.close(1000, "Manual stop") // 정상 종료 코드와 이유 명시
      setWebSocket(null)
    }

    setIsStreaming(false)
    setConnectionState("disconnected")
    setViewerCount(0)
  }

  // 컴포넌트 언마운트 시 방송 정리
  useEffect(() => {
    return () => {
      if (isStreaming) {
        console.log("⏹️ 방송 중지")
        isManualStopRef.current = true
        setReconnectAttempts(0)

        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(
            JSON.stringify({
              type: "stop_broadcast",
              broadcaster_id: userId,
              timestamp: new Date().toISOString(),
            })
          )
        }

        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
          localVideoRef.current.srcObject = null
        }

        if (peerConnection) {
          peerConnection.close()
          setPeerConnection(null)
        }

        if (webSocket) {
          webSocket.close(1000, "Manual stop")
          setWebSocket(null)
        }

        setIsStreaming(false)
        setConnectionState("disconnected")
        setViewerCount(0)
      }
    }
  }, [isStreaming, webSocket, peerConnection, userId])

  return (
    <div css={containerStyle}>
      <h2 css={titleStyle}>🎥 내 방송</h2>
      <div css={infoCardStyle}>
        <div css={infoRowStyle}>
          <span css={labelStyle}>방송자:</span> {userName} (ID: {userId})
        </div>
        <div css={infoRowStyle}>
          <span css={labelStyle}>방송 상태:</span>
          <span css={statusStyle(isStreaming)}>
            {isStreaming ? "🔴 LIVE" : "⚫ OFF"}
          </span>
        </div>
        <div css={infoRowStyle}>
          <span css={labelStyle}>연결 상태:</span> {connectionState}
        </div>
        <div css={infoRowStyle}>
          <span css={labelStyle}>시청자 수:</span>
          <span css={viewerCountStyle}>👥 {viewerCount}명</span>
        </div>
      </div>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        css={videoStyle(isStreaming)}
      />

      <div css={buttonContainerStyle}>
        <button
          onClick={startBroadcast}
          disabled={isStreaming}
          css={buttonStyle(isStreaming, "primary")}
        >
          {isStreaming ? "🔴 방송 중..." : "▶️ 방송 시작"}
        </button>

        <button
          onClick={stopBroadcast}
          disabled={!isStreaming}
          css={buttonStyle(!isStreaming, "danger")}
        >
          ⏹️ 방송 중지
        </button>
      </div>
    </div>
  )
}

export default Broadcast
