/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isDarkModeState } from '../recoil/atoms';
import { dartkTheme, lightTheme, primaryColor, primaryColorHover } from '../styles/colors';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { FaBars } from 'react-icons/fa'; // 햄버거 메뉴 아이콘 추가

// 스타일 정의
const headerWrapperStyle = (isDarkMode: boolean) => css`
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  text-decoration: none;
`;

const navStyle = (isOpen: boolean) => css`
  display: flex;
  gap: 20px;
  list-style: none;

  @media (max-width: 768px) {
    display: ${isOpen ? 'block' : 'none'};
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: ${isOpen ? (isOpen ? '#fff' : '#000') : 'transparent'};
  }
`;

const navItemStyle = (isDarkMode: boolean) => css`
  font-size: 1rem;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  text-decoration: none;
  font-weight: 400;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease, font-weight 0.3s ease;
  &:hover {
    background-color: ${isDarkMode ? `#090909` : `#f5f5f5`};
    font-weight: 600;
  }
`;

const loginButtonStyle = css`
  background-color: ${primaryColor};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1rem;
  &:hover {
    background-color: ${primaryColorHover};
    font-weight: 600;
  }

  // @media (max-width: 768px) {
  //   background-color: transparent;
  //   color: ${primaryColor};
  //   padding: 10px 15px;
  //   font-size: 1rem;
  // }
`;

const hamburgerStyle = css`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const [isDarkMode] = useRecoilState(isDarkModeState);
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div css={headerWrapperStyle(isDarkMode)}>
      <header css={headerContentStyle}>
        {/* 햄버거 메뉴 아이콘 (작은 화면에서 보임) */}
        <FaBars css={hamburgerStyle} color={isDarkMode ? lightTheme.mode.background : dartkTheme.mode.background} onClick={() => setMenuOpen(!isMenuOpen)} />

        <Link to="/" css={logoStyle(isDarkMode)}>
          Gowoobro
        </Link>

        {/* 네비게이션 메뉴 (큰 화면에서 보임) */}
        <nav>
          <ul css={navStyle(isMenuOpen)}>
            <li>
              <Link to="/item1" css={navItemStyle(isDarkMode)}>
                item1
              </Link>
            </li>
            <li>
              <Link to="/item2" css={navItemStyle(isDarkMode)}>
                item2
              </Link>
            </li>
            <li>
              <Link to="/item3" css={navItemStyle(isDarkMode)}>
                item3
              </Link>
            </li>
            <li>
              <Link to="/item4" css={navItemStyle(isDarkMode)}>
                item4
              </Link>
            </li>
          </ul>
        </nav>

        {/* 테마 변경 버튼 및 로그인 버튼 */}
        <ThemeToggleButton />
        <Link to="/login" css={loginButtonStyle}>
          로그인
        </Link>
      </header>
    </div>
  );
};

export default Header;