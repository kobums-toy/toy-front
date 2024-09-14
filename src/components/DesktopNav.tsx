/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const navItemStyle = (isDarkMode: boolean) => css`
  font-size: 1rem;
  color: ${isDarkMode ? '#fff' : '#000'};
  background: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${isDarkMode ? '#090909' : '#f5f5f5'};
  }
`;

interface DesktopNavProps {
  isDarkMode: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav css={navStyle}>
      <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item1')}>
        item1
      </button>
      <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item2')}>
        item2
      </button>
      <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item3')}>
        item3
      </button>
      <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item4')}>
        item4
      </button>
      <ThemeToggleButton />
    </nav>
  );
};

export default DesktopNav;