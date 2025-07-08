/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React, { useEffect, useState, useCallback } from "react"
import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { userInfoState } from "../recoil/atoms"

// 메인 컨테이너 스타일
const containerStyle = css`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

// 헤더 스타일
const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 20px;
`

// 헤더 타이틀 영역 스타일
const headerTitleStyle = css`
  h1 {
    margin: 0 0 10px 0;
    color: #212529;
  }
  p {
    margin: 0;
    color: #6c757d;
  }
`

// 헤더 컨트롤 영역 스타일
const headerControlsStyle = css`
  display: flex;
  gap: 10px;
  align-items: center;
`

// 연결 상태 배지 스타일
const connectionBadgeStyle = (state: string) => {
  const styles = {
    connected: { bg: "#d4edda", color: "#155724" },
    error: { bg: "#f8d7da", color: "#721c24" },
    default: { bg: "#fff3cd", color: "#856404" }
  }
  const style = styles[state as keyof typeof styles] || styles.default
  
  return css`
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    background-color: ${style.bg};
    color: ${style.color};
  `
}

// 기본 버튼 스타일
const buttonStyle = (variant: "primary" | "success", disabled: boolean) => css`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  opacity: ${disabled ? 0.6 : 1};
  transition: background-color 0.2s;
  background-color: ${variant === "primary" ? "#007bff" : "#28a745"};
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${!disabled ? (variant === "primary" ? "#0056b3" : "#1e7e34") : undefined};
  }
`

// 에러 알림 스타일
const errorAlertStyle = css`
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`

// 빈 상태 스타일
const emptyStateStyle = css`
  padding: 60px 40px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;

  h3 {
    margin: 0 0 10px 0;
    color: #495057;
  }
  p {
    margin: 0;
    color: #6c757d;
  }
`

// 방송 목록 그리드 스타일
const broadcastGridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`

// 방송 카드 스타일
const broadcastCardStyle = css`
  padding: 24px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    transform: translateY(-4px);
  }
`

// 라이브 배지 스타일
const liveBadgeStyle = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(45deg, #dc3545, #ff4757);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
`

// 방송자 정보 스타일
const broadcasterInfoStyle = css`
  margin-bottom: 16px;

  h3 {
    margin: 0 0 8px 0;
    color: #212529;
    font-size: 18px;
    font-weight: 600;
  }
`

// 방송 시간 정보 스타일
const timeInfoStyle = css`
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 4px;
`

// 방송 지속 시간 스타일
const durationStyle = css`
  color: #28a745;
  font-size: 14px;
  font-weight: 500;
`

// 통계 정보 스타일
const statsStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
`

// 시청자 수 스타일
const viewerCountStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  font-size: 16px;
  font-weight: 500;
`

// 시청하기 버튼 스타일
const watchButtonStyle = css`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
`

// 사용자 정보 스타일
const userInfoStyle = css`
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
`

// 스피너 스타일
const spinnerStyle = css`
  font-size: 48px;
  margin-bottom: 20px;
`

interface BroadcastInfo {
  broadcaster_id: string
  broadcaster_name: string
  start_time: string
  viewer_count: number
  is_live: boolean
}

const ViewList: React.FC = () => {
  const [broadcastList, setBroadcastList] = useState<BroadcastInfo[]>([])
  const [listWebSocket, setListWebSocket] = useState<WebSocket | null>(null)
  const [listConnectionState, setListConnectionState] =
    useState<string>("disconnected")
  const [connectionError, setConnectionError] = useState<string>("")
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0)

  // 사용자 정보
  const user = useRecoilValue(userInfoState)
  const viewerId = String(user.id || "unknown")
  const viewerName = user.name || `시청자_${viewerId}`

  // 라우터
  const navigate = useNavigate()

  const MAX_RECONNECT_ATTEMPTS = 5

  // WebSocket 연결 함수
  const connectToWebSocket = useCallback(
    async (isReconnect = false) => {
      if (listConnectionState === "connecting") {
        console.log("⚠️ 이미 연결 시도 중입니다.")
        return
      }

      if (isReconnect && reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log("❌ 최대 재연결 시도 횟수 초과")
        setConnectionError("최대 재연결 시도 횟수를 초과했습니다.")
        return
      }

      if (!viewerId || viewerId === "unknown") {
        setConnectionError("유효하지 않은 사용자 ID입니다.")
        return
      }

      // 기존 연결 정리
      if (listWebSocket) {
        listWebSocket.close()
        setListWebSocket(null)
      }

      console.log(
        `🔗 방송 목록 WebSocket 연결 시도 (${reconnectAttempts + 1}/${
          MAX_RECONNECT_ATTEMPTS + 1
        })`
      )
      setListConnectionState("connecting")
      setConnectionError("")

      if (isReconnect) {
        setReconnectAttempts((prev) => prev + 1)
      } else {
        setReconnectAttempts(0)
      }

      const wsUrl = `ws://localhost:9000/p2p/ws?role=viewer_list&user_id=${encodeURIComponent(
        viewerId
      )}&timestamp=${Date.now()}`

      try {
        const listWs = new WebSocket(wsUrl)

        const connectionTimeout = setTimeout(() => {
          if (listWs.readyState === WebSocket.CONNECTING) {
            console.error("⏰ WebSocket 연결 타임아웃")
            listWs.close()
            setListConnectionState("timeout")
            setConnectionError("연결 시간이 초과되었습니다.")

            setTimeout(() => connectToWebSocket(true), 2000)
          }
        }, 10000)

        listWs.onopen = () => {
          clearTimeout(connectionTimeout)
          console.log("✅ 방송 목록 WebSocket 연결 성공")
          setListConnectionState("connected")
          setConnectionError("")
          setReconnectAttempts(0)

          // 연결 성공 후 방송 목록 요청
          setTimeout(() => {
            if (listWs.readyState === WebSocket.OPEN) {
              try {
                listWs.send(JSON.stringify({ type: "get_broadcast_list" }))
                console.log("📤 방송 목록 요청 전송")
              } catch (error) {
                console.error("❌ 방송 목록 요청 실패:", error)
              }
            }
          }, 1000)
        }

        listWs.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("📨 메시지 수신:", message.type)

            switch (message.type) {
              case "connection_established":
                console.log("🎉 서버 연결 확인:", message.data)
                break

              case "broadcast_list":
                console.log(
                  "📋 방송 목록 수신:",
                  message.broadcasts?.length || 0,
                  "개"
                )
                setBroadcastList(message.broadcasts || [])
                break

              case "broadcast_started":
                console.log(
                  "🔴 새 방송 시작:",
                  message.broadcast?.broadcaster_name
                )
                setBroadcastList((prev) => {
                  const exists = prev.find(
                    (b) => b.broadcaster_id === message.broadcast.broadcaster_id
                  )
                  if (exists) {
                    return prev.map((b) =>
                      b.broadcaster_id === message.broadcast.broadcaster_id
                        ? { ...message.broadcast, is_live: true }
                        : b
                    )
                  }
                  return [...prev, { ...message.broadcast, is_live: true }]
                })
                break

              case "broadcast_ended":
                console.log("⚫ 방송 종료:", message.broadcaster_id)
                setBroadcastList((prev) =>
                  prev.filter(
                    (b) => b.broadcaster_id !== message.broadcaster_id
                  )
                )
                break

              case "viewer_count_update":
                setBroadcastList((prev) =>
                  prev.map((b) =>
                    b.broadcaster_id === message.broadcaster_id
                      ? { ...b, viewer_count: message.count }
                      : b
                  )
                )
                break

              case "error":
                console.error("❌ 서버 오류:", message.data)
                setConnectionError(`서버 오류: ${message.data}`)
                break
            }
          } catch (error) {
            console.error("❌ 메시지 처리 오류:", error)
          }
        }

        listWs.onclose = (event) => {
          clearTimeout(connectionTimeout)
          console.log("❌ WebSocket 연결 종료:", event.code)
          setListConnectionState("disconnected")

          let shouldReconnect = false
          let errorMessage = ""

          switch (event.code) {
            case 1000:
              errorMessage = "정상적으로 연결이 종료되었습니다."
              break
            case 1006:
              errorMessage = "연결이 비정상적으로 종료되었습니다."
              shouldReconnect = true
              break
            default:
              errorMessage = `연결이 종료되었습니다 (코드: ${event.code})`
              shouldReconnect = true
          }

          setConnectionError(errorMessage)

          if (shouldReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000)
            console.log(`🔄 ${delay}ms 후 자동 재연결...`)
            setTimeout(() => connectToWebSocket(true), delay)
          }
        }

        listWs.onerror = (error) => {
          clearTimeout(connectionTimeout)
          console.error("❌ WebSocket 오류:", error)
          setListConnectionState("error")
          setConnectionError("WebSocket 연결 오류가 발생했습니다.")
        }

        setListWebSocket(listWs)
      } catch (error) {
        console.error("❌ WebSocket 생성 오류:", error)
        setConnectionError("WebSocket을 생성할 수 없습니다.")
        setListConnectionState("error")
      }
    },
    [viewerId, listConnectionState, reconnectAttempts, listWebSocket]
  )

  // 초기 연결
  useEffect(() => {
    connectToWebSocket(false)
    return () => {
      if (listWebSocket) {
        listWebSocket.close()
      }
    }
  }, [viewerId])

  // 수동 재연결
  const manualReconnect = () => {
    setReconnectAttempts(0)
    connectToWebSocket(false)
  }

  // 방송 목록 새로고침
  const refreshBroadcastList = () => {
    if (listWebSocket && listWebSocket.readyState === WebSocket.OPEN) {
      try {
        listWebSocket.send(JSON.stringify({ type: "get_broadcast_list" }))
        console.log("🔄 방송 목록 새로고침 요청")
      } catch (error) {
        console.error("❌ 새로고침 요청 실패:", error)
        manualReconnect()
      }
    } else {
      manualReconnect()
    }
  }

  // 방송 시청하기 (ViewDetail로 이동)
  const watchBroadcast = (broadcast: BroadcastInfo) => {
    console.log("👀 방송 시청 페이지로 이동:", broadcast.broadcaster_name)
    navigate(`/viewer/${broadcast.broadcaster_id}`, {
      state: {
        broadcast,
        returnTo: "/viewer", // 뒤로가기를 위한 경로
      },
    })
  }

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
      return `${hours}시간 ${minutes}분 방송중`
    } else if (minutes > 0) {
      return `${minutes}분 방송중`
    } else {
      return "방금 시작됨"
    }
  }

  return (
    <div css={containerStyle}>
      {/* 헤더 */}
      <div css={headerStyle}>
        <div css={headerTitleStyle}>
          <h1>📺 라이브 방송 목록</h1>
          <p>현재 {broadcastList.length}개의 방송이 진행중입니다</p>
        </div>

        <div css={headerControlsStyle}>
          <div css={connectionBadgeStyle(listConnectionState)}>
            {listConnectionState === "connected"
              ? "🟢 연결됨"
              : listConnectionState === "error"
              ? "🔴 오류"
              : "🟡 연결중..."}
          </div>

          <button
            onClick={refreshBroadcastList}
            disabled={listConnectionState === "connecting"}
            css={buttonStyle("primary", listConnectionState === "connecting")}
          >
            🔄 새로고침
          </button>

          <button
            onClick={manualReconnect}
            disabled={listConnectionState === "connecting"}
            css={buttonStyle("success", listConnectionState === "connecting")}
          >
            🔗 재연결
          </button>
        </div>
      </div>

      {/* 연결 오류 알림 */}
      {connectionError && (
        <div css={errorAlertStyle}>
          ❌ <span>{connectionError}</span>
          {reconnectAttempts > 0 && (
            <span css={css`font-size: 14px; opacity: 0.8;`}>
              (재연결 시도: {reconnectAttempts}/{MAX_RECONNECT_ATTEMPTS})
            </span>
          )}
        </div>
      )}

      {/* 방송 목록 */}
      {broadcastList.length === 0 ? (
        <div css={emptyStateStyle}>
          <div css={spinnerStyle}>📭</div>
          <h3>현재 방송 중인 채널이 없습니다</h3>
          <p>새로운 방송이 시작되면 자동으로 목록에 표시됩니다</p>
          <button
            onClick={refreshBroadcastList}
            css={[buttonStyle("primary", false), css`margin-top: 20px;`]}
          >
            다시 확인하기
          </button>
        </div>
      ) : (
        <div css={broadcastGridStyle}>
          {broadcastList.map((broadcast) => (
            <div
              key={broadcast.broadcaster_id}
              css={broadcastCardStyle}
              onClick={() => watchBroadcast(broadcast)}
            >
              {/* LIVE 배지 */}
              <div css={liveBadgeStyle}>🔴 LIVE</div>

              {/* 방송자 정보 */}
              <div css={broadcasterInfoStyle}>
                <h3>🎥 {broadcast.broadcaster_name}</h3>
                <div css={timeInfoStyle}>
                  시작: {formatTime(broadcast.start_time)}
                </div>
                <div css={durationStyle}>
                  {formatDuration(broadcast.start_time)}
                </div>
              </div>

              {/* 통계 정보 */}
              <div css={statsStyle}>
                <div css={viewerCountStyle}>
                  👥 {broadcast.viewer_count}명 시청
                </div>

                <div css={watchButtonStyle}>시청하기 →</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 사용자 정보 (하단) */}
      <div css={userInfoStyle}>
        👤 {viewerName} ({viewerId})으로 접속중 • 연결 상태:{" "}
        {listConnectionState} • 총 {broadcastList.length}개 방송 표시중
      </div>
    </div>
  )
}

export default ViewList
