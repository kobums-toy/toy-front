/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { isDarkModeState } from '../recoil/atoms';
import { lightTheme, dartkTheme } from '../styles/colors';

const themeStyle = (isDarkMode: boolean) => css`
  background-color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
  color: ${isDarkMode ? dartkTheme.mode.background : lightTheme.mode.background};
`

const containerStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useRecoilValue(isDarkModeState);

  return <div css={themeStyle(isDarkMode)}><div css={containerStyle}>{children}</div></div>;
};
