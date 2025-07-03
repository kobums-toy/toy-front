/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import Broadcast from "../components/Broadcast"

const containerStyle = css`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

export const BroadcastPage: React.FC = () => {
  return (
    <>
      <div css={containerStyle}>
        <Broadcast />
      </div>
    </>
  )
}
