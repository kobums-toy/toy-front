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
  },
};

export const dartkTheme: DarkTheme = {
  mode: {
    background: '#1a1a1a',
    text: '#ffffff',
    buttonText: '#fff',
    buttonTextHover: '#000',
    buttonBorder: '#fff',
    buttonBg: 'rgba(255, 255, 255, 0)',
    buttonBgHover: 'rgba(255, 255, 255, 1)',
    borderColor: '#4a90e2',
  },
};

export const primaryColor = '#007bff'
export const primaryColorHover = '#0056b3'