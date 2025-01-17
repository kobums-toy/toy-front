/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const HomePage: React.FC = () => {
  return (
    <>
      <div css={containerStyle}></div>
    </>
  )
}
