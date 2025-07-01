/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { css } from "@emotion/react"
import { useGetBoard } from "../hooks/useBoard"
import { BoardItem } from "../models/board"
import { userInfoState } from "../recoil/atoms"
import { useRecoilValue } from "recoil"

const containerStyle = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  // background-color: #fff;
`

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const titleStyle = (theme: any) => css`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${theme.mode.text};
`

const profileStyle = (theme: any) => css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: ${theme.mode.text};
`

const profileImageStyle = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const infoStyle = css`
  font-size: 0.9rem;
  color: #777;
  display: flex;
  gap: 10px;
`

const tagStyle = css`
  display: inline-block;
  background-color: #e0f4ff;
  color: #0073e6;
  border-radius: 12px;
  padding: 5px 10px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 10px;
`

const descriptionStyle = (theme: any) => css`
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.5;
  color: ${theme.mode.text};

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 10px;
    }
  }
`

const imageContainer = css`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  img {
    max-width: 300px;
    border-radius: 10px;
  }
`

const footerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
  margin-top: 20px;
`

const buttonStyle = css`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #e0e0e0;
  }
`

const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetBoard(id ? +id : 0)
  const [boardData, setBoardData] = useState<BoardItem>()
  const userInfo = useRecoilValue(userInfoState) // Retrieve current user's info
  const navigate = useNavigate()

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setBoardData(data.item) // Adjusted to match API response
    }
  }, [data, isLoading, isError])

  if (!boardData) return <p>Loading...</p>

  const handleEdit = () => {
    // Implement edit functionality here
    console.log("Edit post", boardData.id)
    navigate("/board/write", { state: { ...boardData } })
  }

  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Delete post", boardData.id)
  }

  return (
    <div css={containerStyle}>
      {/* Header Section */}
      <div css={headerStyle}>
        <h1 css={titleStyle}>{boardData.title}</h1>
        <div css={infoStyle}>
          {/* <span>조회 수 {boardData.views || 0}</span>
          <span>추천 수 {boardData.recommendations || 0}</span>
          <span>댓글 {boardData.comments || 0}</span> */}
          <span>조회 수 {0}</span>
          <span>추천 수 {0}</span>
          <span>댓글 {0}</span>
        </div>
      </div>

      {/* Profile Section */}
      <div css={profileStyle}>
        <img
          css={profileImageStyle}
          // src={boardData.profileImage || "https://via.placeholder.com/40"}
          // alt={boardData.author}
          src={"https://via.placeholder.com/40"}
          alt={"aa"}
        />
        {/* <span>{boardData.author}</span> */}
        <span>{"aaaa"}</span>
        <span>{new Date(boardData.date).toLocaleDateString()}</span>
      </div>

      {/* Tag Section */}
      {/* <div css={tagStyle}>{boardData.tag || "Docker"}</div> */}
      <div css={tagStyle}>{"Docker"}</div>

      {/* Content Section */}
      <div css={descriptionStyle}>
        <p>{boardData.content}</p>
      </div>

      {/* Image Section */}
      <div css={imageContainer}>
        <img
          src={boardData.img || "https://via.placeholder.com/300"}
          alt="게시글 이미지"
        />
      </div>

      {/* Footer Section */}
      <div css={footerStyle}>
        {/* <span>{boardData.source || "https://source-link.com"}</span> */}
        <span>{"https://source-link.com"}</span>
        <button
          css={buttonStyle}
          // onClick={() => navigator.clipboard.writeText(boardData.source || "https://source-link.com")}
          onClick={() =>
            navigator.clipboard.writeText("https://source-link.com")
          }
        >
          복사
        </button>
      </div>

      {/* Edit and Delete Buttons (Conditionally Rendered) */}
      {boardData.user === userInfo.id && (
        <div css={footerStyle}>
          <button css={buttonStyle} onClick={handleEdit}>
            수정
          </button>
          <button css={buttonStyle} onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

export default BoardDetailPage
