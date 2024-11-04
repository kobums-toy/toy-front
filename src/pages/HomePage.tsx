/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import CardList from '../components/CardList';
import { useGetBoardList } from '../hooks/useBoard';
import Board, { BoardItem } from '../models/board';

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* 전체 화면 높이 */
`;

export const HomePage: React.FC = () => {
  const { data, isLoading, isError } = useGetBoardList();
  const [board, setBoard] = useState<BoardItem[]>([])

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setBoard(data.items); // data.items가 있다고 가정
    }
  }, [data, isLoading, isError]);

  return (
    <>
      <div css={containerStyle}>
        <CardList list={board} />
      </div>
    </>
  );
};