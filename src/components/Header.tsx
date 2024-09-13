/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isDarkModeState } from '../recoil/atoms';
import { dartkTheme, lightTheme, primaryColor, primaryColorHover } from '../styles/colors';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { FaBars, FaTimes } from 'react-icons/fa'; // 햄버거 메뉴 및 X 아이콘 추가
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 useNavigate 사용

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
  background: none;
  border: none;
  cursor: pointer;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  text-decoration: none;
`;

const navStyle = (isMenuOpen: boolean, isDarkMode: boolean) => css`
  display: flex;
  gap: 20px;
  list-style: none;
  align-items: center; /* 수직 중앙 정렬 */

  @media (max-width: 768px) {
    display: ${isMenuOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100vh - 60px); /* 헤더 높이만큼 제외한 화면 전체 덮음 */
    background-color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 999;
  }
`;

const navItemStyle = (isDarkMode: boolean) => css`
  font-size: 1rem;
  color: ${isDarkMode ? dartkTheme.mode.text : lightTheme.mode.text};
  background: none;
  border: none;
  padding: 10px 15px;
  text-align: left;
  cursor: pointer;
  border-radius: 10px; /* 모서리 둥글게 */
  transition: background-color 0.3s ease, font-weight 0.3s ease;
  &:hover {
    background-color: ${isDarkMode ? `#090909` : `#f5f5f5`};
  }
`;

const buttonStyle = css`
  background-color: ${primaryColor};
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  flex-shrink: 0; /* 버튼이 작아지지 않도록 설정 */
  min-width: 80px; /* 최소 너비 설정 */
  &:hover {
    background-color: ${primaryColorHover};
  }

  @media (max-width: 768px) {
    // background-color: transparent;
    // color: ${primaryColor};
    // padding: 10px 15px;
    // font-size: 1.5rem;
  }
`;

const headerTitle = css`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const hamburgerStyle = css`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Header: React.FC = () => {
  const [isDarkMode] = useRecoilState(isDarkModeState);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  const handleNavigation = (path: string) => {
    navigate(path); // 버튼 클릭 시 페이지 이동
  };

  return (
    <div css={headerWrapperStyle(isDarkMode)}>
      <header css={headerContentStyle}>
        {/* 햄버거 메뉴 아이콘과 X 아이콘 */}
        <div css={headerTitle}>
          <div css={hamburgerStyle} onClick={() => setMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <button css={logoStyle(isDarkMode)} onClick={() => handleNavigation('/')}>
            Gowoobro
          </button>
        </div>
        {/* 네비게이션 메뉴 */}
        <nav>
          <ul css={navStyle(isMenuOpen, isDarkMode)}>
            <li>
              <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item1')}>
                item1
              </button>
            </li>
            <li>
              <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item2')}>
                item2
              </button>
            </li>
            <li>
              <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item3')}>
                item3
              </button>
            </li>
            <li>
              <button css={navItemStyle(isDarkMode)} onClick={() => handleNavigation('/item4')}>
                item4
              </button>
            </li>
            {/* 테마 토글 버튼을 네비게이션의 마지막 항목으로 배치 */}
            <li>
              <ThemeToggleButton />
            </li>
          </ul>
        </nav>

        <button css={buttonStyle} onClick={() => handleNavigation('/login')}>
          로그인
        </button>
      </header>
    </div>
  );
};

export default Header;