/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { userInfoState } from "../recoil/atoms"

// 메인 컨테이너 스타일
const containerStyle = css`
  min-height: 100vh;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
`

// 상단 헤더 스타일
const headerStyle = css`
  background-color: #374151;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

// 헤더 왼쪽 영역 스타일
const headerLeftStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// 헤더 오른쪽 영역 스타일
const headerRightStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// 뒤로가기 버튼 스타일
const backButtonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6b7280;
  }
`

// 방송자 정보 스타일
const broadcasterInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// 방송자 이름 스타일
const broadcasterNameStyle = css`
  font-size: 1.25rem;
  font-weight: bold;
`

// 라이브 표시 스타일
const liveIndicatorStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

// 라이브 도트 스타일
const liveDotStyle = css`
  width: 0.5rem;
  height: 0.5rem;
  background-color: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

// 라이브 텍스트 스타일
const liveTextStyle = css`
  color: #ef4444;
  font-weight: 600;
`

// 시청자 수 스타일
const viewerCountStyle = css`
  font-size: 0.875rem;
  color: #d1d5db;
`

// 연결 상태 스타일
const connectionStateStyle = (state: string) => {
  const colors = {
    connecting: "#d97706",
    connected: "#059669",
    disconnected: "#6b7280",
    failed: "#dc2626"
  }
  return css`
    font-size: 0.875rem;
    color: ${colors[state as keyof typeof colors] || "#6b7280"};
  `
}

// 방송 정보 바 스타일
const broadcastInfoBarStyle = css`
  background-color: #111827;
  padding: 1rem;
  border-bottom: 1px solid #374151;
`

// 방송 정보 내용 스타일
const broadcastInfoContentStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #d1d5db;
`

// 비디오 영역 스타일
const videoAreaStyle = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 1rem;
`

// 비디오 컨테이너 스타일
const videoContainerStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 72rem;
  max-height: 80vh;
  background-color: #111827;
  border-radius: 0.5rem;
  overflow: hidden;
`

// 오버레이 스타일
const overlayStyle = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111827;
  z-index: 10;
`

// 로딩 스피너 스타일
const spinnerStyle = css`
  width: 3rem;
  height: 3rem;
  border: 2px solid transparent;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// 에러 아이콘 스타일
const errorIconStyle = css`
  font-size: 3.75rem;
  color: #ef4444;
  margin-bottom: 1rem;
`

// 비디오 스타일
const videoStyle = (isVisible: boolean) => css`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: ${isVisible ? "block" : "none"};
`

// 하단 컨트롤 스타일
const bottomControlStyle = css`
  background-color: #374151;
  padding: 1rem;
`

// 컨트롤 내용 스타일
const controlContentStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

// 컨트롤 왼쪽 영역 스타일
const controlLeftStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// 컨트롤 오른쪽 영역 스타일
const controlRightStyle = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #d1d5db;
`

// 컨트롤 버튼 스타일
const controlButtonStyle = (variant: "primary" | "danger", disabled: boolean) => css`
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  opacity: ${disabled ? 0.5 : 1};
  transition: background-color 0.2s;
  background-color: ${variant === "primary" ? "#2563eb" : "#dc2626"};
  color: white;

  &:hover {
    background-color: ${!disabled ? (variant === "primary" ? "#1d4ed8" : "#b91c1c") : undefined};
  }
`

// 텍스트 센터 스타일
const textCenterStyle = css`
  text-align: center;
`

// 텍스트 화이트 스타일
const textWhiteStyle = css`
  color: white;
`

// 텍스트 그레이 스타일
const textGrayStyle = css`
  color: #d1d5db;
`

// 마진 바텀 스타일
const mb2Style = css`
  margin-bottom: 0.5rem;
`

const mb4Style = css`
  margin-bottom: 1rem;
`

// 텍스트 크기 스타일
const textXlStyle = css`
  font-size: 1.25rem;
`

interface BroadcastInfo {
  broadcaster_id: string
  broadcaster_name: string
  start_time: string
  viewer_count: number
  is_live: boolean
}

const ViewDetail: React.FC = () => {
  const { id: broadcasterId } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // location.state에서 방송 정보 가져오기
  const broadcastInfo = location.state?.broadcast as BroadcastInfo
  const returnTo = location.state?.returnTo || "/viewer"

  // WebRTC 관련 상태
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [connectionState, setConnectionState] = useState<string>("disconnected")
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [viewerCount, setViewerCount] = useState<number>(
    broadcastInfo?.viewer_count || 0
  )
  const [error, setError] = useState<string>("")

  // 사용자 정보
  const user = useRecoilValue(userInfoState)
  const viewerId = String(user.id || "unknown")
  const viewerName = user.name || `시청자_${viewerId}`

  // 방송 정보 상태
  const [currentBroadcast, setCurrentBroadcast] =
    useState<BroadcastInfo | null>(broadcastInfo)
  const [isLoadingBroadcast, setIsLoadingBroadcast] = useState<boolean>(false)

  // 방송 정보 가져오기
  const fetchBroadcastInfo = async (broadcasterId: string) => {
    setIsLoadingBroadcast(true)
    try {
      const response = await fetch(
        `http://localhost:9000/api/broadcasts/${broadcasterId}`
      )
      if (response.ok) {
        const broadcast = await response.json()
        setCurrentBroadcast(broadcast)
        return broadcast
      } else {
        throw new Error("방송 정보를 가져올 수 없습니다.")
      }
    } catch (error) {
      console.error("방송 정보 조회 오류:", error)
      setError("방송 정보를 불러오는데 실패했습니다.")
      return null
    } finally {
      setIsLoadingBroadcast(false)
    }
  }

  // 방송 시청 시작
  const startWatching = async () => {
    if (!broadcasterId) {
      setError("방송 ID가 없습니다.")
      return
    }

    let broadcast = currentBroadcast
    if (!broadcast) {
      broadcast = await fetchBroadcastInfo(broadcasterId)
      if (!broadcast) return
    }

    setIsConnecting(true)
    setError("")

    try {
      console.log("👀 방송 시청 시작:", broadcast.broadcaster_name)

      const ws = new WebSocket(
        `ws://localhost:9000/p2p/ws?role=viewer&user_id=${encodeURIComponent(
          viewerId
        )}&user_name=${encodeURIComponent(
          viewerName
        )}&broadcaster_id=${encodeURIComponent(broadcasterId)}`
      )

      ws.onopen = () => {
        console.log("✅ 시청자 WebSocket 연결 성공")
        setConnectionState("connecting")

        // 스트림 요청 (시청자 참여도 포함)
        const requestMessage = {
          type: "request_stream",
          broadcaster_id: String(broadcasterId),
          viewer_id: String(viewerId),
          viewer_name: viewerName,
        }
        ws.send(JSON.stringify(requestMessage))
        console.log("📤 스트림 요청 전송")
      }

      let pc: RTCPeerConnection | null = null

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log("📨 시청자 메시지 수신:", message.type)

          if (
            message.type === "offer" &&
            String(message.broadcaster_id) === String(broadcasterId)
          ) {
            console.log("🔔 SDP Offer 수신")

            pc = new RTCPeerConnection({
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
              const state = pc?.connectionState || "disconnected"
              console.log("🔗 WebRTC 연결 상태:", state)
              setConnectionState(state)

              if (state === "connected") {
                setIsConnecting(false)
                setError("")
              } else if (state === "failed") {
                setError("WebRTC 연결에 실패했습니다.")
                setIsConnecting(false)
              }
            }

            pc.oniceconnectionstatechange = () => {
              console.log("❄️ ICE 연결 상태:", pc?.iceConnectionState)
            }

            pc.ontrack = (event) => {
              console.log("📡 비디오 트랙 수신:", event.track.kind)

              const [stream] = event.streams
              if (stream && remoteVideoRef.current) {
                console.log("🎥 비디오 스트림 연결")
                remoteVideoRef.current.srcObject = stream

                remoteVideoRef.current.onloadedmetadata = () => {
                  console.log("📐 비디오 메타데이터 로드 완료")
                  setIsConnecting(false)
                }

                remoteVideoRef.current.onerror = (error) => {
                  console.error("❌ 비디오 로드 오류:", error)
                  setError("비디오를 재생할 수 없습니다.")
                  setIsConnecting(false)
                }

                // 메타데이터 로드 타임아웃 설정
                setTimeout(() => {
                  if (isConnecting) {
                    console.log("⏰ 비디오 로드 타임아웃")
                    setIsConnecting(false)
                  }
                }, 10000)
              } else {
                console.error("❌ 비디오 엘리먼트 또는 스트림이 없습니다")
                setError("비디오를 표시할 수 없습니다.")
                setIsConnecting(false)
              }
            }

            pc.onicecandidate = (event) => {
              if (event.candidate) {
                ws.send(
                  JSON.stringify({
                    type: "candidate",
                    data: event.candidate,
                    broadcaster_id: String(broadcasterId),
                    viewer_id: String(viewerId),
                  })
                )
              }
            }

            setPeerConnection(pc)

            // SDP 설정
            if (!message.data || typeof message.data !== "string") {
              throw new Error("유효하지 않은 SDP 데이터")
            }

            await pc.setRemoteDescription({
              type: "offer",
              sdp: message.data,
            })

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            ws.send(
              JSON.stringify({
                type: "answer",
                data: answer.sdp,
                broadcaster_id: String(broadcasterId),
                viewer_id: String(viewerId),
              })
            )
          }

          // ICE Candidate 처리
          if (message.type === "candidate" && pc && message.data) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(message.data))
            } catch (error) {
              console.error("❌ ICE candidate 추가 실패:", error)
            }
          }

          // 시청자 수 업데이트
          if (
            message.type === "viewer_count_update" &&
            message.broadcaster_id === broadcasterId
          ) {
            setViewerCount(message.count)
          }

          // 에러 처리
          if (message.type === "error") {
            setError(`서버 오류: ${message.data}`)
            setIsConnecting(false)
          }
        } catch (error) {
          console.error("❌ 메시지 처리 오류:", error)
          setError("메시지 처리 중 오류가 발생했습니다.")
        }
      }

      ws.onclose = (event) => {
        console.log("❌ WebSocket 연결 종료:", event.code)
        setConnectionState("disconnected")

        if (event.code === 1006) {
          setError("연결이 비정상적으로 종료되었습니다.")
        } else if (event.code !== 1000) {
          setError("서버와의 연결이 끊어졌습니다.")
        }
        setIsConnecting(false)
      }

      ws.onerror = (error) => {
        console.error("❌ WebSocket 오류:", error)
        setError("서버 연결 오류가 발생했습니다.")
        setIsConnecting(false)
      }

      setWebSocket(ws)
    } catch (error) {
      console.error("❌ 시청 시작 오류:", error)
      setError("방송 시청을 시작할 수 없습니다.")
      setIsConnecting(false)
    }
  }

  // 시청 중지
  const stopWatching = (sendLeaveMessage = true) => {
    console.log("⏹️ 방송 시청 중지")

    // 시청자 떠남 알림 전송 (필요한 경우에만)
    if (
      sendLeaveMessage &&
      webSocket &&
      webSocket.readyState === WebSocket.OPEN
    ) {
      try {
        const leaveMessage = {
          type: "viewer_leave",
          broadcaster_id: String(broadcasterId),
          viewer_id: String(viewerId),
        }
        webSocket.send(JSON.stringify(leaveMessage))
        console.log("📤 시청자 떠남 알림 전송")
        console.log(broadcasterId, viewerId, "시청자 떠남 알림 전송")
      } catch (error) {
        console.error("❌ 시청자 떠남 알림 전송 실패:", error)
      }
    }

    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    if (webSocket) {
      webSocket.close()
      setWebSocket(null)
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    setConnectionState("disconnected")
    setIsConnecting(false)
    setError("")
  }

  // 뒤로가기
  const goBack = () => {
    console.log(returnTo, "뒤로가기 클릭")
    stopWatching()
    navigate(returnTo)
  }

  // 컴포넌트 마운트 시 자동 시청 시작
  useEffect(() => {
    if (broadcasterId) {
      startWatching()
    } else {
      setError("방송 정보가 없습니다.")
    }

    return () => {
      stopWatching(false) // cleanup에서는 메시지 전송하지 않음
    }
  }, [broadcasterId])

  // 브라우저 새로고침/닫기 시 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        // 시청자 떠남을 알림
        webSocket.send(
          JSON.stringify({
            type: "viewer_leave",
            broadcaster_id: String(broadcasterId),
            viewer_id: String(viewerId),
          })
        )
      }
      stopWatching(false) // beforeunload에서는 이미 메시지를 보냈으므로 중복 방지
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [webSocket, broadcasterId, viewerId])

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000)

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    } else {
      return `${minutes}분`
    }
  }

  // 연결 상태 텍스트
  const getConnectionStateText = () => {
    switch (connectionState) {
      case "connecting":
        return "연결 중..."
      case "connected":
        return "연결됨"
      case "disconnected":
        return "연결 해제"
      case "failed":
        return "연결 실패"
      default:
        return "알 수 없음"
    }
  }


  return (
    <div css={containerStyle}>
      {/* 상단 헤더 */}
      <div css={headerStyle}>
        <div css={headerLeftStyle}>
          <button onClick={goBack} css={backButtonStyle}>
            ← 뒤로가기
          </button>

          {currentBroadcast && (
            <div css={broadcasterInfoStyle}>
              <h1 css={broadcasterNameStyle}>
                {currentBroadcast.broadcaster_name}
              </h1>
              <div css={liveIndicatorStyle}>
                <span css={liveDotStyle}></span>
                <span css={liveTextStyle}>LIVE</span>
              </div>
            </div>
          )}
        </div>

        <div css={headerRightStyle}>
          <div css={viewerCountStyle}>
            시청자 {viewerCount.toLocaleString()}명
          </div>
          <div css={connectionStateStyle(connectionState)}>
            {getConnectionStateText()}
          </div>
        </div>
      </div>

      {/* 방송 정보 */}
      {currentBroadcast && (
        <div css={broadcastInfoBarStyle}>
          <div css={broadcastInfoContentStyle}>
            <div>시작 시간: {formatTime(currentBroadcast.start_time)}</div>
            <div>방송 시간: {formatDuration(currentBroadcast.start_time)}</div>
          </div>
        </div>
      )}

      {/* 비디오 영역 */}
      <div css={videoAreaStyle}>
        <div css={videoContainerStyle}>
          {/* 로딩 표시 */}
          {(isConnecting || isLoadingBroadcast) && (
            <div css={overlayStyle}>
              <div css={textCenterStyle}>
                <div css={spinnerStyle}></div>
                <p css={textWhiteStyle}>
                  {isLoadingBroadcast
                    ? "방송 정보 불러오는 중..."
                    : "방송에 연결 중..."}
                </p>
              </div>
            </div>
          )}

          {/* 에러 표시 */}
          {error && (
            <div css={overlayStyle}>
              <div css={[textCenterStyle, css`padding: 2rem;`]}>
                <div css={errorIconStyle}>⚠️</div>
                <h2 css={[textXlStyle, textWhiteStyle, mb2Style]}>연결 오류</h2>
                <p css={[textGrayStyle, mb4Style]}>{error}</p>
                <button
                  onClick={startWatching}
                  css={controlButtonStyle("primary", false)}
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 비디오 엘리먼트 */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            css={videoStyle(
              !isConnecting && !error && connectionState === "connected"
            )}
          />

          {/* 연결 해제 상태 */}
          {connectionState === "disconnected" && !isConnecting && !error && (
            <div css={overlayStyle}>
              <div css={textCenterStyle}>
                <div css={css`font-size: 3.75rem; color: #6b7280; margin-bottom: 1rem;`}>📺</div>
                <h2 css={[textXlStyle, textWhiteStyle, mb2Style]}>방송 연결 대기 중</h2>
                <p css={textGrayStyle}>
                  방송자의 스트림을 기다리고 있습니다...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div css={bottomControlStyle}>
        <div css={controlContentStyle}>
          <div css={controlLeftStyle}>
            <button
              onClick={() =>
                connectionState === "connected" ? stopWatching : startWatching
              }
              disabled={isConnecting}
              css={controlButtonStyle(
                connectionState === "connected" ? "danger" : "primary",
                isConnecting
              )}
            >
              {isConnecting
                ? "연결 중..."
                : connectionState === "connected"
                ? "시청 중지"
                : "시청 시작"}
            </button>
          </div>

          <div css={controlRightStyle}>
            <div>시청자 ID: {viewerId}</div>
            <div>시청자명: {viewerName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetail
