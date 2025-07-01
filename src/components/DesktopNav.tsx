/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import { useNavigate } from "react-router-dom"

const navStyle = css`
  display: flex;
  gap: 20px;
  list-style: none;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 모바일 화면에서는 기본 nav 숨김 */
  }
`

const navItemStyle = (theme: any) => css`
  font-size: 1rem;
  color: ${theme.mode.text};
  background: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${theme.mode.hoverColor};
  }
`

const DesktopNav: React.FC = () => {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <nav css={navStyle}>
      <button css={navItemStyle} onClick={() => handleNavigation("/")}>
        DashBoard
      </button>
      <button css={navItemStyle} onClick={() => handleNavigation("/board")}>
        Board
      </button>
      {/* <button css={navItemStyle} onClick={() => handleNavigation("/webrtc")}>
        webrtc
      </button> */}
      <button css={navItemStyle} onClick={() => handleNavigation("/broadcast")}>
        broadcast
      </button>
      <button css={navItemStyle} onClick={() => handleNavigation("/Viewer")}>
        Viewer
      </button>
    </nav>
  )
}

export default DesktopNav
