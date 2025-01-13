/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const buttonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fee500; /* Naver 노란색 */
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

const NaverLoginButton: React.FC = () => {
  const doNaverLogin = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URL;
    const scope = 'profile_nickname account_email profile_image name';

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=STATE_STRING`;

    // Redirect user to Naver authorization page
    window.location.href = naverAuthUrl;
  };

  return (
    <button css={buttonStyle} onClick={doNaverLogin}>
      <img src="/kakao_login/pngegg.png" alt="Naver Logo" />
      Login with Naver
    </button>
  );
};

export default NaverLoginButton;