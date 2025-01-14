/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import LoginForm from '../components/LoginForm';

const containerStyle = css`
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  height: 100vh; /* 화면 전체 높이 */
`;

const formWrapperStyle = css`
  // flex-shrink: 0; /* 자식 요소 크기 축소 방지 */
  // padding: 20px; /* 여백 추가 */
  // background-color: white; /* 폼의 배경색 */
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  // border-radius: 10px; /* 둥근 모서리 */
  transform: translateY(-20%); /* 요소를 Y축으로 위로 20% 이동 */
`;

const LoginPage: React.FC = () => {
  return (
    <div css={containerStyle}>
      <div css={formWrapperStyle}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;