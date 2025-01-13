/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const buttonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fee500; /* Google 노란색 */
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
  }
`;

const GoogleLoginButton: React.FC = () => {
  const doGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const scope = 'email profile';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Redirect user to Google authorization page
    window.location.href = googleAuthUrl;
  };

  return (
    <button css={buttonStyle} onClick={doGoogleLogin}>
      <img src="/kakao_login/pngegg.png" alt="Google Logo" />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;