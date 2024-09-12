/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* 전체 화면 높이 */
`;

export const HomePage: React.FC = () => {
  return (
    <>
      <div css={containerStyle}>
        {/* <ThemeToggleButton /> 테마 전환 버튼 추가 */}
      </div>
    </>
  );
};