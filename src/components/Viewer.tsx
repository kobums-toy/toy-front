import React, { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { userInfoState } from "../recoil/atoms" // 경로는 실제 구조에 맞게 수정

interface BroadcastInfo {
  broadcaster_id: string
  broadcaster_name: string
  start_time: string
  viewer_count: number
  is_live: boolean
}

const Viewer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null)
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [listWebSocket, setListWebSocket] = useState<WebSocket | null>(null)
  const [connectionState, setConnectionState] = useState<string>("disconnected")

  // 방송 목록 관련 상태
  const [broadcastList, setBroadcastList] = useState<BroadcastInfo[]>([])
  const [selectedBroadcast, setSelectedBroadcast] =
    useState<BroadcastInfo | null>(null)
  const [isWatching, setIsWatching] = useState<boolean>(false)
  const [listConnectionState, setListConnectionState] =
    useState<string>("disconnected")

  // 사용자 인증 정보 (문자열로 변환 보장)
  const user = useRecoilValue(userInfoState)
  const viewerId = String(user.id || "unknown")
  const viewerName = user.name || `시청자_${viewerId}`

  // 디버깅용 상태 로그
  useEffect(() => {
    console.log("🔍 현재 상태 디버깅:")
    console.log("- viewerId:", viewerId, "(type:", typeof viewerId, ")")
    console.log("- viewerName:", viewerName)
    console.log("- broadcastList:", broadcastList)
    console.log("- listConnectionState:", listConnectionState)
    console.log("- user 객체:", user)
  }, [viewerId, viewerName, broadcastList, listConnectionState, user])

  // 방송 목록 가져오기를 위한 WebSocket 연결
  useEffect(() => {
    if (!viewerId || viewerId === "unknown") {
      console.warn("⚠️ 유효하지 않은 viewerId:", viewerId)
      return
    }

    console.log("🔗 방송 목록 WebSocket 연결 시도...")
    setListConnectionState("connecting")

    const listWs = new WebSocket(
      `ws://localhost:9000/p2p/ws?role=viewer_list&user_id=${viewerId}&user_name=${encodeURIComponent(
        viewerName
      )}`
    )

    listWs.onopen = () => {
      console.log("✅ 방송 목록 WebSocket 연결 성공")
      setListConnectionState("connected")

      // 연결 후 즉시 방송 목록 요청
      const requestMessage = { type: "get_broadcast_list" }
      console.log("📤 방송 목록 요청 전송:", requestMessage)
      listWs.send(JSON.stringify(requestMessage))

      // 추가로 3초 후 다시 요청 (디버깅용)
      setTimeout(() => {
        if (listWs.readyState === WebSocket.OPEN) {
          console.log("📤 방송 목록 재요청 전송")
          listWs.send(JSON.stringify(requestMessage))
        }
      }, 3000)
    }

    listWs.onmessage = (event) => {
      try {
        console.log("📨 원본 메시지 수신:", event.data)
        const message = JSON.parse(event.data)
        console.log("📨 파싱된 메시지:", message)

        switch (message.type) {
          case "broadcast_list":
            console.log("📋 방송 목록 수신:", message.broadcasts)
            setBroadcastList(message.broadcasts || [])
            if (!message.broadcasts || message.broadcasts.length === 0) {
              console.log("📭 수신된 방송 목록이 비어있음")
            }
            break

          case "broadcast_started":
            console.log("🔴 새 방송 시작 알림:", message.broadcast)
            setBroadcastList((prev) => {
              const exists = prev.find(
                (b) => b.broadcaster_id === message.broadcast.broadcaster_id
              )
              if (exists) {
                console.log("📝 기존 방송 정보 업데이트")
                return prev.map((b) =>
                  b.broadcaster_id === message.broadcast.broadcaster_id
                    ? { ...message.broadcast, is_live: true }
                    : b
                )
              }
              console.log("➕ 새 방송 추가")
              return [...prev, { ...message.broadcast, is_live: true }]
            })
            break

          case "broadcast_ended":
            console.log("⚫ 방송 종료 알림:", message.broadcaster_id)
            setBroadcastList((prev) =>
              prev.filter((b) => b.broadcaster_id !== message.broadcaster_id)
            )

            // 현재 시청 중인 방송이 종료된 경우
            if (selectedBroadcast?.broadcaster_id === message.broadcaster_id) {
              console.log("🛑 시청 중인 방송이 종료됨")
              stopWatching()
            }
            break

          case "viewer_count_update":
            console.log(
              "👥 시청자 수 업데이트:",
              message.broadcaster_id,
              message.count
            )
            setBroadcastList((prev) =>
              prev.map((b) =>
                b.broadcaster_id === message.broadcaster_id
                  ? { ...b, viewer_count: message.count }
                  : b
              )
            )
            break

          default:
            console.log("❓ 알 수 없는 메시지 타입:", message.type)
        }
      } catch (error) {
        console.error("❌ 방송 목록 메시지 처리 오류:", error)
        console.error("❌ 원본 데이터:", event.data)
      }
    }

    listWs.onclose = (event) => {
      console.log("❌ 방송 목록 WebSocket 연결 종료:", event.code, event.reason)
      setListConnectionState("disconnected")
    }

    listWs.onerror = (error) => {
      console.error("❌ 방송 목록 WebSocket 오류:", error)
      setListConnectionState("error")
    }

    setListWebSocket(listWs)

    return () => {
      console.log("🧹 방송 목록 WebSocket 정리")
      listWs.close()
    }
  }, [viewerId])

  // 수동으로 방송 목록 새로고침
  const refreshBroadcastList = () => {
    if (listWebSocket && listWebSocket.readyState === WebSocket.OPEN) {
      console.log("🔄 수동 방송 목록 새로고침")
      listWebSocket.send(JSON.stringify({ type: "get_broadcast_list" }))
    } else {
      console.warn("⚠️ 방송 목록 WebSocket이 연결되지 않음")
    }
  }

  const startWatching = async (broadcast: BroadcastInfo) => {
    try {
      console.log("👀 방송 시청 시작:", broadcast)
      setSelectedBroadcast(broadcast)

      const ws = new WebSocket(
        `ws://localhost:9000/p2p/ws?role=viewer&user_id=${encodeURIComponent(
          viewerId
        )}&user_name=${encodeURIComponent(
          viewerName
        )}&broadcaster_id=${encodeURIComponent(broadcast.broadcaster_id)}`
      )

      ws.onopen = () => {
        console.log("✅ 시청자 WebSocket 연결 성공")
        // 방송 시청 요청 (모든 ID를 문자열로 보장)
        const requestMessage = {
          type: "request_stream",
          broadcaster_id: String(broadcast.broadcaster_id),
          viewer_id: String(viewerId),
          viewer_name: viewerName,
        }
        console.log("📤 스트림 요청 전송:", requestMessage)
        ws.send(JSON.stringify(requestMessage))
      }

      let pc: RTCPeerConnection | null = null

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log("📨 시청자 WebSocket 메시지 수신:", message)

          if (
            message.type === "offer" &&
            String(message.broadcaster_id) === String(broadcast.broadcaster_id)
          ) {
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
              console.log(
                "트랙 정보:",
                event.track.kind,
                event.track.readyState
              )

              const [stream] = event.streams
              if (stream && remoteVideoRef.current) {
                console.log("🎥 스트림을 video 엘리먼트에 연결:", stream.id)
                remoteVideoRef.current.srcObject = stream
                setIsWatching(true)

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
                console.log(
                  "❄️ Viewer ICE Candidate 전송:",
                  event.candidate.type
                )
                ws.send(
                  JSON.stringify({
                    type: "candidate",
                    data: event.candidate,
                    broadcaster_id: String(broadcast.broadcaster_id),
                    viewer_id: String(viewerId),
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
                broadcaster_id: String(broadcast.broadcaster_id),
                viewer_id: String(viewerId),
              })
            )
            console.log("📤 SDP Answer 전송 완료")
          }

          // ICE Candidate 처리
          if (message.type === "candidate" && pc) {
            console.log("❄️ ICE Candidate 수신:", message.data.type)
            await pc.addIceCandidate(new RTCIceCandidate(message.data))
            console.log("✅ ICE Candidate 추가 완료")
          }

          if (message.type === "error") {
            console.error("❌ 서버 오류:", message.data)
          }
        } catch (error) {
          console.error("❌ 메시지 처리 오류:", error)
        }
      }

      ws.onclose = (event) => {
        console.log("❌ 시청자 WebSocket 연결 종료:", event.code, event.reason)
        setConnectionState("disconnected")
        setIsWatching(false)
      }

      ws.onerror = (error) => {
        console.error("❌ 시청자 WebSocket 오류:", error)
      }

      setWebSocket(ws)
    } catch (error) {
      console.error("❌ 방송 시청 시작 오류:", error)
    }
  }

  const stopWatching = () => {
    console.log("⏹️ 방송 시청 중지")

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

    setSelectedBroadcast(null)
    setIsWatching(false)
    setConnectionState("disconnected")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "white" }}>📺 라이브 방송 시청</h2>

      {/* 디버깅 정보 패널 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <h4>🔍 디버깅 정보</h4>
        <div>
          <strong>사용자 ID:</strong> {viewerId} (타입: {typeof viewerId})
        </div>
        <div>
          <strong>사용자 이름:</strong> {viewerName}
        </div>
        <div>
          <strong>목록 연결 상태:</strong> {listConnectionState}
        </div>
        <div>
          <strong>방송 목록 개수:</strong> {broadcastList.length}
        </div>
        <button
          onClick={refreshBroadcastList}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 목록 새로고침
        </button>
      </div>

      {!isWatching ? (
        <div>
          <h3 style={{ color: "white" }}>🔴 현재 방송 중인 채널</h3>
          {broadcastList.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                color: "#6c757d",
              }}
            >
              <p style={{ fontSize: "18px", margin: "0", color: "white" }}>
                📭 현재 방송 중인 채널이 없습니다
              </p>
              <p
                style={{
                  fontSize: "14px",
                  margin: "10px 0 0 0",
                  color: "white",
                }}
              >
                목록 연결 상태: {listConnectionState}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
              {broadcastList.map((broadcast) => (
                <div
                  key={broadcast.broadcaster_id}
                  style={{
                    padding: "20px",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.15)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                  onClick={() => startWatching(broadcast)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 8px 0", color: "#495057" }}>
                        🎥 {broadcast.broadcaster_name}
                      </h4>
                      <p
                        style={{
                          margin: "0",
                          color: "#6c757d",
                          fontSize: "14px",
                        }}
                      >
                        시작 시간: {formatTime(broadcast.start_time)}
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#6c757d",
                          fontSize: "12px",
                        }}
                      >
                        ID: {broadcast.broadcaster_id}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: "#dc3545",
                          fontWeight: "bold",
                          marginBottom: "5px",
                        }}
                      >
                        🔴 LIVE
                      </div>
                      <div style={{ color: "#007bff", fontSize: "14px" }}>
                        👥 {broadcast.viewer_count}명 시청
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div>
                <strong>시청 중:</strong> {selectedBroadcast?.broadcaster_name}
              </div>
              <div>
                <strong>연결 상태:</strong> {connectionState}
              </div>
            </div>
            <button
              onClick={stopWatching}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ⏹️ 시청 중지
            </button>
          </div>

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            controls
            style={{
              width: "100%",
              backgroundColor: "black",
              minHeight: "400px",
              borderRadius: "8px",
              border: "3px solid #dc3545",
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Viewer
