/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import LoginLogoutButton from './LoginButton';
import MobileOverlayNav from './MobileOverlayNav';

const headerWrapperStyle = (theme: any) => css`
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${theme.mode.background};
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

const logoStyle = (theme: any) => css`
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.mode.text};
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

const Header: React.FC = () => {

  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setMenuOpen(false); // 메뉴 닫기
    navigate(path); // 페이지 이동
  };

  return (
    <div>
      <div css={headerWrapperStyle}>
        <header css={headerContentStyle}>
          <button css={logoStyle} onClick={() => handleNavigation('/')}>
            Gowoobro
          </button>
          <DesktopNav />
          <LoginLogoutButton />
          <div css={hamburgerStyle} onClick={() => setMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </header>
      </div>

      <MobileOverlayNav isMenuOpen={isMenuOpen} />
    </div>
  );
};

export default Header;