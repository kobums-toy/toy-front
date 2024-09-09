import '@emotion/react';

declare module '@emotion/react' {
  export interface LightTheme {
    mode: {
      text: string;
      background: string;
      buttonText: string;
      buttonTextHover: string;
      buttonBorder: string;
      buttonBg: string;
      buttonBgHover: string;
      borderColor: string;
    };
  }

  export interface DarkTheme {
    mode: {
      text: string;
      background: string;
      buttonText: string;
      buttonTextHover: string;
      buttonBorder: string;
      buttonBg: string;
      buttonBgHover: string;
      borderColor: string;
    };
  }
}