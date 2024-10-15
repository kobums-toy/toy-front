/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import CardList from '../components/CardList';
import FloatingActionButton from '../components/FloatingActionButton';

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
        <CardList />
        <FloatingActionButton />
      </div>
    </>
  );
};