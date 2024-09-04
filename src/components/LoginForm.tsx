/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const formStyle = css`
  display: flex;
  flex-direction: column;
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isLoading, error } = useAuth();

  // onSubmit 이벤트 타입을 명시합니다.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ username, password });
  };

  return (
    <form css={formStyle} onSubmit={handleSubmit}>
      <>
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
        {error && <p style={{ color: 'red' }}>Login failed. Please try again.</p>}
      </>
    </form>
  );
};

export default LoginForm;