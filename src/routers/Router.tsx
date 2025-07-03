import React, { useEffect } from "react"
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom"
import { useRecoilState } from "recoil"
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"
import { authState } from "../recoil/atoms"
import { HomePage } from "../pages/HomePage"
import BoardDetailPage from "../pages/BoardDetailPage"
import { BoardPage } from "../pages/BoardPage"
import BoardInseartPage from "../pages/BoardInseartPage"
import SignUpPage from "../pages/SignUpPage"
import { BroadcastPage } from "../pages/BroadcastPage"
import { ViewerPage } from "../pages/ViewerPage"
import { ViewDetailPage } from "../pages/ViewDetailPage"

const RouterComponent: React.FC = () => {
  const [authToken, setAuthToken] = useRecoilState(authState)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    console.log("현재 인증 상태:", authToken)
  }, [authToken])

  // 인증이 필요한 라우트를 위한 래퍼 컴포넌트
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (!authToken.isAuthenticated) {
      // 현재 경로를 state로 저장하여 로그인 후 원래 페이지로 돌아갈 수 있게 함
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <>{children}</>
  }

  // 로그인된 사용자가 로그인 페이지에 접근하지 못하게 하는 래퍼
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (authToken.isAuthenticated) {
      // 로그인 후 이전 페이지나 홈으로 리다이렉트
      const from = location.state?.from?.pathname || "/"
      return <Navigate to={from} replace />
    }
    return <>{children}</>
  }

  return (
    <Routes>
      {/* 기본 경로 */}
      <Route path="/" element={<HomePage />} />

      {/* 공개 페이지 (로그인된 사용자는 접근 제한) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* 게시판 페이지 (현재는 인증 불필요) */}
      <Route path="/board" element={<BoardPage />} />
      <Route path="/board/:id" element={<BoardDetailPage />} />

      {/* 게시글 작성은 인증 필요할 수도 있음 */}
      <Route
        path="/board/write"
        element={
          <ProtectedRoute>
            <BoardInseartPage />
          </ProtectedRoute>
        }
      />

      {/* 스트리밍 관련 페이지 (인증 필수) */}
      <Route
        path="/broadcast"
        element={
          <ProtectedRoute>
            <BroadcastPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewer"
        element={
          <ProtectedRoute>
            <ViewerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewer/:id"
        element={
          <ProtectedRoute>
            <ViewDetailPage />
          </ProtectedRoute>
        }
      />

      {/* 404 페이지 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default RouterComponent
