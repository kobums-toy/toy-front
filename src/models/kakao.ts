import request from '../global/request'

export interface UserItem {
  id: number;
  email: string;
  name: string;
  passwd: string;
  date: string;
  extra: object;
}

export default class Kakao {
  static async kakaoLogin(params: any) {
    const res = await request({
      method: 'GET',
      url: `/api/oauth/token`,
      params: params
    })

    return res.data
  }
}
