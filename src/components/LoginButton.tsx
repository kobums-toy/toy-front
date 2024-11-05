/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authState, userInfoState } from '../recoil/atoms';

const buttonStyle = css`
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 80px;
  &:hover {
    background-color: #1766d1;
  }
`;

const LoginLogoutButton: React.FC = () => {
  const auth = useRecoilValue(authState);
  const resetAuth = useResetRecoilState(authState)
  const resetUserInfo = useResetRecoilState(userInfoState)

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    resetAuth()
    resetUserInfo()
    navigate('/login');
  };

  return (
    <button css={buttonStyle} onClick={auth.isAuthenticated ? handleLogout : handleLogin}>
      {auth.isAuthenticated ? '로그아웃' : '로그인'}
    </button>
  );
};

export default LoginLogoutButton;