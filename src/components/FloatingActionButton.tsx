/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { FaTimes, FaCog } from 'react-icons/fa'; // X 아이콘과 톱니바퀴 아이콘

// FAB 스타일 정의
const fabStyle = (isActive: boolean) => css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: ${isActive ? '#e0e0e0' : '#1a73e8'}; /* 비활성화 시 파란색, 활성화 시 회색 */
  color: ${isActive ? '#333' : 'white'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: ${isActive ? '#d1d1d1' : '#1766d1'}; /* 호버 시 색상 변화 */
  }
`;

// 아이콘 스타일 정의
const iconStyle = css`
  font-size: 24px;
`;

const FloatingActionButton: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive); // 클릭 시 활성화/비활성화 상태 토글
  };

  return (
    <div css={fabStyle(isActive)} onClick={handleClick}>
      {/* 활성화 상태에서는 X 아이콘, 비활성화 상태에서는 톱니바퀴 아이콘 */}
      {isActive ? <FaTimes css={iconStyle} /> : <FaCog css={iconStyle} />}
    </div>
  );
};

export default FloatingActionButton;