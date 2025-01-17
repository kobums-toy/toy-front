import request from "../global/request"

export interface UserItem {
  id: number
  email: string
  name: string
  passwd: string
  date: string
  extra: object
}

export default class Naver {
  static async googleLogin(params: any) {
    const res = await request({
      method: "GET",
      url: `/api/oauth/google`,
      params: params,
    })

    return res.data
  }
}
