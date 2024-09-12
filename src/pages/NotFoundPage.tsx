/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { isDarkModeState } from '../recoil/atoms';
import { dartkTheme, lightTheme } from '../styles/colors';

// 스타일 정의
const containerStyle = (isDarkMode: Boolean) => css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const headingStyle = css`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const messageStyle = (isDarkMode: Boolean) => css`
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 40px;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
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
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);


  return (
    <div css={containerStyle(isDarkMode)}>
      {/* 아이콘 대신 텍스트 */}
      <h1 css={headingStyle}>404 Not Found</h1>
      <p css={messageStyle(isDarkMode)}>
        The link was a dream,<br />
        A shadow of what once was—<br />
        Now, nothing remains.
      </p>
      <Link to="/" css={linkStyle}>Go Back Home</Link>
    </div>
  );
};

export default NotFoundPage;