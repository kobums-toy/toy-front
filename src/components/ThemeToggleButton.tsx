/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isDarkModeState, themeModeState } from '../recoil/atoms';

// 아이콘은 예시로 설정
import { FaSun, FaMoon, FaCheck } from 'react-icons/fa';
import { MdComputer } from "react-icons/md";
import { dartkTheme, lightTheme } from '../styles/colors';
import useMediaQuery from '../hooks/useMediaQeury';

const buttonGroupStyle = (isDarkMode: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
  padding: 5px;
  border-radius: 40px;
  border: 1px solid ${isDarkMode ? dartkTheme.mode.borderColor : lightTheme.mode.borderColor};
  width: fit-content;
`;

const buttonStyle = (isSelected: boolean, isDarkMode: boolean) => css`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  background-color: ${isSelected ? (isDarkMode ? '#9bbcff' : '#2563eb') : 'transparent'};
  color: ${isDarkMode ? (isSelected ? '#000000' : '#cccccc') : (isSelected ? '#ffffff' : '#5f6368')};
  border-radius: 30px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: ${isDarkMode ? (isSelected ? '#000000' : '#ffffff') : (isSelected ? '#ffffff' : '#000000')};
  }

  svg {
    font-size: 1.2rem;
  }
`;

export const ThemeToggleButton: React.FC = () => {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);

  const setIsThemeMode = useSetRecoilState(themeModeState);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // 기기 설정 감지

  useEffect(() => {
    setIsThemeMode(themeMode)
    if (themeMode === 'auto') {
      setIsDarkMode(prefersDarkMode);
    } else {
      setIsDarkMode(themeMode == 'dark' ? true : false);
    }
  }, [themeMode, prefersDarkMode, setIsThemeMode]);

  return (
    <div css={buttonGroupStyle(isDarkMode)}>
      <button
        css={buttonStyle(themeMode === 'light', isDarkMode)}
        onClick={() => setThemeMode('light')}
      >
        {themeMode === 'light' ? <FaCheck /> : <FaSun />}
        밝게
      </button>
      <button
        css={buttonStyle(themeMode === 'dark', isDarkMode)}
        onClick={() => setThemeMode('dark')}
      >
        {themeMode === 'dark' ? <FaCheck /> : <FaMoon />}
        어둡게
      </button>
      <button
        css={buttonStyle(themeMode === 'auto', isDarkMode)}
        onClick={() => setThemeMode('auto')}
      >
        {themeMode === 'auto' ? <FaCheck /> : <MdComputer />}
        기기
      </button>
    </div>
  );
};