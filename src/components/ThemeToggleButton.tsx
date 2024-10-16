/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';

// 아이콘은 예시로 설정
import { FaSun, FaMoon, FaCheck } from 'react-icons/fa';
import { MdComputer } from "react-icons/md";

const buttonGroupStyle = (theme: any) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.mode.background};
  padding: 5px;
  border-radius: 40px;
  border: 1px solid ${theme.mode.borderColor};
  width: fit-content;
`;

const buttonStyle = (isSelected: boolean, theme: any) => css`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  background-color: ${isSelected ? theme.mode.toggleButtonBgHover : 'transparent'};
  color: ${isSelected ? theme.mode.buttonTextSelect : theme.mode.buttonTextUnselected};
  border-radius: 30px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: ${isSelected ? theme.mode.buttonTextSelect : theme.mode.text};
  }

  svg {
    font-size: 1.2rem;
  }
`;

interface ThemeToggleButtonProps {
  onThemeChange: (mode: 'light' | 'dark' | 'auto') => void; // 테마 변경 콜백 함수
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ onThemeChange }) => {
  const theme = useTheme()
  const [selectedMode, setSelectedMode] = React.useState<'light' | 'dark' | 'auto'>('auto');

  const handleButtonClick = (mode: 'light' | 'dark' | 'auto') => {
    setSelectedMode(mode);
    onThemeChange(mode); // 부모 컴포넌트(App)에서 테마 모드를 변경하도록 함
    console.log("aaa")
  };

  return (
    <div css={buttonGroupStyle(theme)}>
      <button
        css={buttonStyle(selectedMode === 'light', theme)}
        onClick={() => handleButtonClick('light')}
      >
        {selectedMode === 'light' ? <FaCheck /> : <FaSun />}
        밝게
      </button>
      <button
        css={buttonStyle(selectedMode === 'dark', theme)}
        onClick={() => handleButtonClick('dark')}
      >
        {selectedMode === 'dark' ? <FaCheck /> : <FaMoon />}
        어둡게
      </button>
      <button
        css={buttonStyle(selectedMode === 'auto', theme)}
        onClick={() => handleButtonClick('auto')}
      >
        {selectedMode === 'auto' ? <FaCheck /> : <MdComputer />}
        기기 설정
      </button>
    </div>
  );
};

export default ThemeToggleButton