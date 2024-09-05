import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: false,
});

export const authTokenState = atom<string | null>({
  key: 'authTokenState',
  default: null,
});

// 다크모드 상태
export const isDarkModeState = atom<boolean>({
  key: 'isDarkModeState',
  default: false, // 기본적으로 다크모드가 꺼져있음
});