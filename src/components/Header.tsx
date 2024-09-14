/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isDarkModeState } from '../recoil/atoms';
import { dartkTheme, lightTheme } from '../styles/colors';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileOverlayNav from './MobileOverlayNav';

const headerWrapperStyle = (isDarkMode: boolean) => css`
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1100;
`;

const headerContentStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 10px 20px;
`;

const logoStyle = (isDarkMode: boolean) => css`
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  text-decoration: none;
`;

const hamburgerStyle = css`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  align-items: center;

  @media (max-width: 768px) {
    display: flex; /* 모바일 화면에서만 햄버거 메뉴 표시 */
  }
`;

const buttonStyle = css`
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 80px;
  &:hover {
    background-color: #1766d1;
  }
`;


const Header: React.FC = () => {
  const [isDarkMode] = useRecoilState(isDarkModeState);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setMenuOpen(false); // 메뉴 닫기
    navigate(path); // 페이지 이동
  };

  return (
    <div>
      <div css={headerWrapperStyle(isDarkMode)}>
        <header css={headerContentStyle}>
          <button css={logoStyle(isDarkMode)} onClick={() => handleNavigation('/')}>
            Gowoobro
          </button>
          <DesktopNav isDarkMode={isDarkMode} />
          <button css={buttonStyle} onClick={() => handleNavigation('/login')}>
            로그인
          </button>
          <div css={hamburgerStyle} onClick={() => setMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </header>
      </div>

      <MobileOverlayNav isDarkMode={isDarkMode} isMenuOpen={isMenuOpen} />
    </div>
  );
};

export default Header;