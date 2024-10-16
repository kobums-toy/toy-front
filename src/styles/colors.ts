import { DarkTheme, LightTheme } from '@emotion/react';

export const lightTheme: LightTheme = {
  mode: {
    background: '#ffffff',
    text: '#000000',
    buttonText: '#000',
    buttonTextHover: '#fff',
    buttonBorder: '#000',
    buttonBg: 'rgba(0, 0, 0, 0)',
    buttonBgHover: 'rgba(0, 0, 0, 1)',
    borderColor: '#a2c3fc',
    hoverColor: '#f5f5f5',
    toggleButtonBgHover: '#2563eb',
    buttonTextUnselected: '#5f6368', // 선택되지 않은 버튼 텍스트 색상
    buttonTextSelect: '#ffffff',   // 선택된 버튼 텍스트 색상
    cardBoxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    overlayBoxShadow: '0px 12px 12px 12px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: DarkTheme = {
  mode: {
    background: '#1a1a1a',
    text: '#ffffff',
    buttonText: '#fff',
    buttonTextHover: '#000',
    buttonBorder: '#fff',
    buttonBg: 'rgba(255, 255, 255, 0)',
    buttonBgHover: 'rgba(255, 255, 255, 1)',
    borderColor: '#4a90e2',
    hoverColor: '#090909',
    toggleButtonBgHover: '#9bbcff',
    buttonTextUnselected: '#cccccc', // 선택되지 않은 버튼 텍스트 색상
    buttonTextSelect: '#000000',   // 선택된 버튼 텍스트 색상
    cardBoxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)',
    overlayBoxShadow: '0px 12px 12px 12px rgba(255, 255, 255, 0.1)',
  },
};

export const primaryColor = '#007bff'
export const primaryColorHover = '#0056b3'