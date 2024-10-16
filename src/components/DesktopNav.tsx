/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    background-color: ${theme.mode.hoverColor};
  }
`;

const DesktopNav: React.FC = () => {
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
    </nav>
  );
};

export default DesktopNav;