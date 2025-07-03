/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import ViewList from "../components/ViewList"

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const ViewerPage: React.FC = () => {
  return (
    <>
      <div css={containerStyle}>
        <ViewList />
      </div>
    </>
  )
}
