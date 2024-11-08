/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 카드 스타일
const cardStyle = (theme: any) => css`
  background-color: ${theme.mode.background};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  box-shadow: ${theme.mode.cardBoxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${theme.mode.cardBoxShadow};
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
  max-width: fit-content; /* 내용에 맞게 크기를 조정 */
  text-overflow: ellipsis; /* 긴 텍스트가 잘리도록 처리 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden; /* 텍스트가 길어질 경우 숨김 */
`;

interface CardItemProps {
  id: number;
  title: string;
  author: string;
  time: string;
  views: number;
  profileImage: string;
  tag: string;
  img?: string;
}

const CardItem: React.FC<CardItemProps> = ({ id, title, author, time, views, profileImage, tag, img }) => {
  ; // 현재 테마 정보를 가져오기
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${id}`); // 각 카드 아이템의 ID에 따라 상세 페이지로 이동
  };

  return (
    <div css={cardStyle} onClick={handleClick}>
      {img && <img src={img} alt={title} css={imageStyle} />}
      <div css={profileStyle}>
        <img src={profileImage} alt={author} css={profileImageStyle} />
        <div>
          <span>{author}</span>
        </div>
      </div>
      <div css={titleStyle}>{title}</div>
      <div css={infoStyle}>
        {time} 분량 · 조회수 {views}
      </div>
      <div css={tagStyle}>{tag}</div>
    </div>
  );
};

export default CardItem;