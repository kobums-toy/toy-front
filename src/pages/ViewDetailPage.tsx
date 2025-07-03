/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import ViewDetail from "../components/ViewDetail"

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const ViewDetailPage: React.FC = () => {
  return (
    <>
      <div css={containerStyle}>
        <ViewDetail />
      </div>
    </>
  )
}
