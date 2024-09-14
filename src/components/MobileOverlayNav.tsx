/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

const overlayStyle = (isMenuOpen: boolean, isDarkMode: boolean) => css`
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${isDarkMode ? '#1a1a1a' : '#fff'};
  transform: ${isMenuOpen ? 'translateY(0)' : 'translateY(-100vh)'};
  transition: transform 0.8s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1000;
  gap: 20px;

  @media (min-width: 769px) {
    display: none; /* 데스크탑에서는 오버레이 숨김 */
  }
`;

const menuItemStyle = (isDarkMode: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  color: ${isDarkMode ? '#fff' : '#000'};
  width: 100vw;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 20px;
  &:hover {
    opacity: 0.8;
  }
`;

const arrowIconStyle = css`
  opacity: 0;
  transition: opacity 0.3s ease;
  svg {
    font-size: 1.5rem;
  }
  &:hover {
    opacity: 1;
  }
`;

interface MobileOverlayNavProps {
  isDarkMode: boolean;
  isMenuOpen: boolean;
}

const MobileOverlayNav: React.FC<MobileOverlayNavProps> = ({ isDarkMode, isMenuOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div css={overlayStyle(isMenuOpen, isDarkMode)}>
      <div css={menuItemStyle(isDarkMode)} onClick={() => handleNavigation('/item1')}>
        item1
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle(isDarkMode)} onClick={() => handleNavigation('/item2')}>
        item2
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle(isDarkMode)} onClick={() => handleNavigation('/item3')}>
        item3
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle(isDarkMode)} onClick={() => handleNavigation('/item4')}>
        item4
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <ThemeToggleButton />
    </div>
  );
};

export default MobileOverlayNav;