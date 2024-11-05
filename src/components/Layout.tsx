/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import React from 'react';

const themeStyle = (theme: any) => css`
  background-color: ${theme.mode.background};
  color: ${theme.mode.background};
`

const containerStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme()

  return (
    <div css={themeStyle(theme)}>
      <div css={containerStyle}>
        {children}
      </div>
    </div>
  )
};
