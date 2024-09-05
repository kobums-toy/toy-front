/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import LoginForm from '../components/LoginForm';

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* 전체 화면 높이 */
  padding-top: 33vh; /* 1/3 지점에 위치 */
`;

const LoginPage: React.FC = () => {
  return (
    <div css={containerStyle}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;