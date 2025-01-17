/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import request from "../global/request" // request 함수는 Axios를 설정한 모듈로 가정합니다.
import { css } from "@emotion/react"

const detailStyle = css`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`

const imageStyle = css`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 20px;
`

interface CardDetailData {
  title: string
  image: string
  content: string
  author: string
  profileImage: string
}

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [cardData, setCardData] = useState<CardDetailData | null>(null)

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await request.get(`/api/card/${id}`)
        setCardData(response.data) // 서버 응답 데이터를 state에 저장
      } catch (error) {
        console.error("Failed to fetch card details:", error)
      }
    }

    fetchCardData()
  }, [id])

  if (!cardData) return <p>Loading...</p>

  return (
    <div css={detailStyle}>
      <h1>{cardData.title}</h1>
      {cardData.image && (
        <img src={cardData.image} alt={cardData.title} css={imageStyle} />
      )}
      <p>{cardData.content}</p>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <img
          src={cardData.profileImage}
          alt={cardData.author}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginRight: "15px",
          }}
        />
        <h3>{cardData.author}</h3>
      </div>
    </div>
  )
}

export default CardDetail
