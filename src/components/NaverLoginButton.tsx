/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const buttonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #03C75A; /* Naver 노란색 */
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #FFF; /* 하얀색 텍스트 */
  transition: background-color 0.3s;

  &:hover {
    background-color: #03C75A;
  }

  img {
    margin-right: 8px; /* 로고와 텍스트 간격 */
    height: 24px; /* 로고 크기 *
    width: 24px;
    object-fit: contain;
    display: block;
  }
`;

const imgStyle = css`
  filter: brightness(0) invert(1); /* 아이콘 색상을 흰색으로 변경 */
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
      <img src="/naver_login/naver_logo_upscaled_3.png" alt="Naver Logo" css={imgStyle}/>
      Login with Naver
    </button>
  );
};

export default NaverLoginButton;