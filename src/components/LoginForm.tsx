/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useAuth, useKakaoAuth } from '../hooks/useAuth';
import { primaryColor, primaryColorHover } from '../styles/colors';
import { Link, useLocation } from 'react-router-dom';
import Modal from './Modal';
import KakaoLoginButton from './KakaoLoginButton';

const formStyle = css`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const inputStyle = css`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const buttonStyle = css`
  padding: 10px;
  background-color: ${primaryColor};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${primaryColorHover};
  }
`;

const signUpLinkStyle = css`
  margin-top: 10px;
  text-align: center;
  font-size: 0.9rem;
  color: ${primaryColor};

  a {
    color: ${primaryColor};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('honggildong@naver.com');
  const [password, setPassword] = useState('qwer1234!');
  const { mutate: login, isLoading, error } = useAuth();
  const { mutate: kakaoLogin, isLoading: kakaoLoginLoading, error: kakaoLoginError } = useKakaoAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const location = useLocation(); // Get the current location

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code'); // Extract the "code" parameter

    if (code) {
      console.log('Kakao login code:', code);
      kakaoLogin({ client_id: process.env.REACT_APP_KAKAO_JS_KEY, redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URL, grant_type: 'authorization_code', code: code });
    } else {
      console.error('No code parameter found in the URL');
    }
  }, [location.search]);

  // onSubmit 이벤트 타입을 명시합니다.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login({ email: username, passwd: password }, {
      onError: () => setShowErrorModal(true),
    });
  }

  return (
    <>
      <form css={formStyle} onSubmit={handleSubmit}>
        <input
          css={inputStyle}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          css={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button css={buttonStyle} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div css={signUpLinkStyle}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </form>
      <KakaoLoginButton />
      {showErrorModal && (
        <Modal
          type="error"
          message={(error as Error)?.message || 'An error occurred. Please try again.'}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default LoginForm;