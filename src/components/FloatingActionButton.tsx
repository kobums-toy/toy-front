/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { FaTimes, FaCog } from 'react-icons/fa';
import ThemeToggleButton from './ThemeToggleButton';

// FAB 스타일 정의
const fabStyle = (isActive: boolean) => css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: ${isActive ? '#e0e0e0' : '#1a73e8'};
  color: ${isActive ? '#333' : 'white'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: ${isActive ? '#d1d1d1' : '#1766d1'};
  }
`;

// 아이콘 스타일 정의
const iconStyle = css`
  font-size: 24px;
`;

// 오버레이 스타일 정의
const overlayStyle = (isVisible: boolean, theme: any) => css`
  background-color: ${theme.mode.background};
  position: fixed;
  bottom: 90px; /* FAB 버튼 바로 위에 오버레이가 위치하도록 조정 */
  right: 20px;
  width: 350px;
  height: 400px;
  border-radius: 20px;
  box-shadow: ${theme.mode.overlayBoxShadow};
  transition: transform 0.3s ease;
  transform: ${isVisible ? 'translateY(0)' : 'translateY(100%)'};
  z-index: 999;
  padding: 20px;
  display: ${isVisible ? 'block' : 'none'}; /* FAB 버튼을 눌렀을 때만 보이도록 */
`;

const FloatingActionButton: React.FC = () => {
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      {/* FAB 버튼 */}
      <div css={fabStyle(isActive)} onClick={handleClick}>
        {isActive ? <FaTimes css={iconStyle} /> : <FaCog css={iconStyle} />}
      </div>

      {/* FAB를 눌렀을 때 나오는 오버레이 */}
      <div css={overlayStyle(isActive, theme)}>
        <ThemeToggleButton />
      </div>
    </>
  );
};

export default FloatingActionButton;