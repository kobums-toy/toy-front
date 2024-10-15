/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import CardItem from './CardItem';

const cardListStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-items: center;
`;

const CardList: React.FC = () => {
  const cards = [
    {
      title: "유니티 협업 프로젝트 공유하는 방법 툴 정리",
      author: "parker",
      time: "1분",
      views: 47,
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      tag: "Unity",
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "[Vitepress] Vitepress footnote tooltip",
      author: "신규현",
      time: "2분",
      views: 373,
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      tag: "ReactJS",
      image: "https://via.placeholder.com/300x200"
    },
    // 다른 카드들...
  ];

  return (
    <div css={cardListStyle}>
      {cards.map((card, index) => (
        <CardItem
          key={index}
          title={card.title}
          author={card.author}
          time={card.time}
          views={card.views}
          profileImage={card.profileImage}
          tag={card.tag}
          image={card.image}
        />
      ))}
    </div>
  );
};

export default CardList;