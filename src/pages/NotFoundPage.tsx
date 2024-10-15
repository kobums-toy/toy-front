/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';
import { Link } from 'react-router-dom';

// 스타일 정의
const containerStyle = (theme: any) => css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: ${theme.mode.text};
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const headingStyle = css`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const messageStyle = (theme: any) => css`
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 40px;
  color: ${theme.mode.text};
`;

const linkStyle = css`
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #4a90e2;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #357ab8;
  }
`;

const NotFoundPage: React.FC = () => {
  const theme = useTheme()

  return (
    <div css={containerStyle(theme)}>
      {/* 아이콘 대신 텍스트 */}
      <h1 css={headingStyle}>404 Not Found</h1>
      <p css={messageStyle(theme)}>
        The link was a dream,<br />
        A shadow of what once was—<br />
        Now, nothing remains.
      </p>
      <Link to="/" css={linkStyle}>Go Back Home</Link>
    </div>
  );
};

export default NotFoundPage;