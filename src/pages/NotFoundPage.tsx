/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';

// 스타일 정의
const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a; /* 어두운 배경 */
  color: white;
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const headingStyle = css`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const messageStyle = css`
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 40px;
  color: #ccc;
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
  return (
    <div css={containerStyle}>
      {/* 아이콘 대신 텍스트 */}
      <h1 css={headingStyle}>404 Not Found</h1>
      <p css={messageStyle}>
        The link was a dream,<br />
        A shadow of what once was—<br />
        Now, nothing remains.
      </p>
      <Link to="/" css={linkStyle}>Go Back Home</Link>
    </div>
  );
};

export default NotFoundPage;