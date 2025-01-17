/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import { BoardItem } from "../models/board"
import CardItem from "./CardItem"

const cardListStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-items: center;
`

interface CardListProps {
  list: BoardItem[]
}

const CardList: React.FC<CardListProps> = ({ list }) => {
  return (
    <div css={cardListStyle}>
      {Array.isArray(list) &&
        list.map((card, index) => (
          <CardItem
            key={index}
            id={card.id}
            title={card.title}
            author={"김XX"}
            time={"3분"}
            views={223}
            profileImage={"https://randomuser.me/api/portraits/women/44.jpg"}
            tag={"ReactJS"}
            img={card.img}
          />
        ))}
    </div>
  )
}

export default CardList
