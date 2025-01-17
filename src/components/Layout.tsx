/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react"
import React from "react"

const themeStyle = (theme: any) => css`
  background-color: ${theme.mode.background};
  color: ${theme.mode.background};
  min-height: 100vh; /* Ensures the layout covers the entire viewport height */
`

const containerStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 0px 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div css={themeStyle}>
      <div css={containerStyle}>{children}</div>
    </div>
  )
}
