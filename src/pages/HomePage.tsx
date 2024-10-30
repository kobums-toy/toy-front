/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import CardList from '../components/CardList';
import Board, { BoardItem } from '../models/Board';

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh; /* 전체 화면 높이 */
`;

export const HomePage: React.FC = () => {
  const [board, setBoard] = useState<BoardItem[]>([])

  useEffect(() => {
    getBoards()
  }, [])

  const getBoards = async () => {
    let res = await Board.find({
      // id: 0,
      // title: '',
      // content: '',
      // img: '',
      // startdate: '',
      // enddate: '',
    })
    setBoard(res.items)
    console.log(res.items)
  }


  return (
    <>
      <div css={containerStyle}>
        <CardList list={board} />
      </div>
    </>
  );
};