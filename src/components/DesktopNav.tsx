/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dartkTheme } from '../styles/colors';
import ThemeToggleButton from './ThemeToggleButton';

const navStyle = css`
  display: flex;
  gap: 20px;
  list-style: none;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 모바일 화면에서는 기본 nav 숨김 */
  }
`;

const navItemStyle = (theme: any) => css`
  font-size: 1rem;
  color: ${theme.mode.text};
  background: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${theme.mode == dartkTheme.mode ? '#090909' : '#f5f5f5'};
  }
`;

interface DesktopNavProps {
  onThemeChange: (mode: 'light' | 'dark' | 'auto') => void; // 테마 변경 함수
}

const DesktopNav: React.FC<DesktopNavProps> = ({ onThemeChange }) => {
  const theme = useTheme()
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav css={navStyle}>
      <button css={navItemStyle(theme)} onClick={() => handleNavigation('/item1')}>
        item1
      </button>
      <button css={navItemStyle(theme)} onClick={() => handleNavigation('/item2')}>
        item2
      </button>
      <button css={navItemStyle(theme)} onClick={() => handleNavigation('/item3')}>
        item3
      </button>
      <button css={navItemStyle(theme)} onClick={() => handleNavigation('/item4')}>
        item4
      </button>
      <ThemeToggleButton onThemeChange={onThemeChange} />
    </nav>
  );
};

export default DesktopNav;