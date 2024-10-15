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
// export const isDarkModeState = atom<boolean>({
//   key: 'isDarkModeState',
//   default: false, // 기본적으로 다크모드가 꺼져있음
// });

// 테마 모드 상태 (기본값: auto)
// export const themeModeState = atom<'auto' | 'light' | 'dark'>({
//   key: 'themeModeState',
//   default: 'auto', // 기기 설정에 따라 자동으로 테마 적용
// });