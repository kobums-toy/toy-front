import { atom, AtomEffect } from "recoil"

const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue))
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue))
    })
  }

export const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: false,
    accessToken: null as string | null,
  },
  effects: [localStorageEffect("auth")],
})

export const userInfoState = atom({
  key: "userInfoState",
  default: {
    id: 0,
    passwd: "",
    email: "",
    name: "",
    date: "",
    extra: {},
  },
  effects: [localStorageEffect("userInfo")],
})

// 테마 모드 상태(기본값: auto)
export const themeModeState = atom<"auto" | "light" | "dark">({
  key: "themeModeState",
  default: "auto", // 기기 설정에 따라 자동으로 테마 적용
  effects: [localStorageEffect("themeModeState")],
})
