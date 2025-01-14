/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';
import { themeModeState } from '../recoil/atoms';

const buttonStyle = (darkmode: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF; /* Google 하얀색 */
  border: ${darkmode ? 'none' : 'solid 1px'};
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #000; /* 검은색 텍스트 */
  transition: background-color 0.3s;

  &:hover {
    background-color: #FFFFFF;
  }

  img {
    margin-right: 8px; /* 로고와 텍스트 간격 */
    height: 24px; /* 로고 크기 */
    width: 24px;
  }
`;

const GoogleLoginButton: React.FC = () => {
  const themeModea = useRecoilValue(themeModeState)
  const doGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const scope = 'email profile';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Redirect user to Google authorization page
    window.location.href = googleAuthUrl;
  };

  return (
    <button css={buttonStyle(themeModea === 'dark')} onClick={doGoogleLogin}>
      <img src="/google_login/google_logo.png" alt="Google Logo" />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;