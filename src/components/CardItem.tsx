/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';

// 카드 스타일
const cardStyle = (theme: any) => css`
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// 이미지 스타일
const imageStyle = css`
  width: 100%;
  border-radius: 10px;
`;

// 프로필 스타일
const profileStyle = (theme: any) => css`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: ${theme.mode.text};
`;

// 프로필 이미지
const profileImageStyle = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

// 제목 스타일
const titleStyle = (theme: any) => css`
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${theme.mode.text}; /* 텍스트 색상은 테마에 따라 변경 */
`;

// 작성자 정보 스타일
const infoStyle = (theme: any) => css`
  font-size: 0.85rem;
  color: ${theme.mode.text}; /* 텍스트 색상은 테마에 따라 변경 */
  margin-top: 5px;
`;

// 태그 스타일
const tagStyle = (theme: any) => css`
  background-color: ${theme.mode.borderColor};
  color: ${theme.mode.text};
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 0.75rem;
  margin-top: 10px;
  display: inline-block;
`;

interface CardItemProps {
  title: string;
  author: string;
  time: string;
  views: number;
  profileImage: string;
  tag: string;
  image?: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, author, time, views, profileImage, tag, image }) => {
  const theme = useTheme(); // 현재 테마 정보를 가져오기
  console.log(theme)

  return (
    <div css={cardStyle(theme)}>
      {image && <img src={image} alt={title} css={imageStyle} />}
      <div css={profileStyle}>
        <img src={profileImage} alt={author} css={profileImageStyle} />
        <div>
          <span>{author}</span>
        </div>
      </div>
      <div css={titleStyle(theme)}>{title}</div>
      <div css={infoStyle(theme)}>
        {time} 분량 · 조회수 {views}
      </div>
      <div css={tagStyle(theme)}>{tag}</div>
    </div>
  );
};

export default CardItem;