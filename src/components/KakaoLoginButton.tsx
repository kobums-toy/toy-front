/** @jsxImportSource @emotion/react */
import React from "react"
import { css } from "@emotion/react"

const buttonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fee500; /* Kakao 노란색 */
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #000; /* 검은색 텍스트 */
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffd900;
  }

  img {
    margin-right: 8px; /* 로고와 텍스트 간격 */
    height: 24px; /* 로고 크기 */
    width: 24px;
  }
`

const KakaoLoginButton: React.FC = () => {
  const doKakaoLogin = () => {
    const clientId = process.env.REACT_APP_KAKAO_JS_KEY
    const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URL
    const scope = "profile_nickname account_email profile_image name"

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`

    // Redirect user to Kakao authorization page
    window.location.href = kakaoAuthUrl
  }

  return (
    <button css={buttonStyle} onClick={doKakaoLogin}>
      <img src="/kakao_login/pngegg.png" alt="Kakao Logo" />
      Login with Kakao
    </button>
  )
}

export default KakaoLoginButton
