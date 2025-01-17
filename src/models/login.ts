import request from "../global/request"

export default class Login {
  static async login(item: any) {
    const res = await request({
      method: "GET",
      url: "/api/jwt",
      params: item,
    })
    return res.data
  }
}
