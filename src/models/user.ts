import request from "../global/request"

export interface UserItem {
  id: number
  email: string
  name: string
  passwd: string
  date: string
  extra: object
}

export default class User {
  // static readonly level = { normal: 1, manager: 2, admin: 3, rootadmin: 4 } as const
  // static readonly levels = ['', '일반', '팀장', '관리자', '전체관리자']
  // static readonly status = { use: 1, notuse: 2 } as const
  // static readonly statuss = ['', '사용', '사용안함']
  // static readonly approval = { wait: 1, reject: 2, complete: 3 } as const
  // static readonly approvals = ['', '미승인', ' 거절', '승인']

  // static getLevel(value: number) {
  //   return this.levels[value]
  // }

  // static getStatus(value: number) {
  //   return this.statuss[value]
  // }

  // static getApproval(value: number) {
  //   return this.approvals[value]
  // }

  static async insert(item: any) {
    const res = await request({
      method: "POST",
      url: "/api/user",
      data: item,
    })

    return res.data
  }

  static async update(item: any) {
    const res = await request({
      method: "PUT",
      url: "/api/user",
      data: item,
    })

    return res.data
  }

  static async remove(item: any) {
    const res = await request({
      method: "DELETE",
      url: "/api/user",
      data: item,
    })

    return res.data
  }

  static async find(params: any) {
    const res = await request({
      method: "GET",
      url: "/api/user",
      params: params,
    })

    if (res.data.items == null) {
      res.data.items = []
    }

    return res.data
  }

  static async count(params: any) {
    const res = await request({
      method: "GET",
      url: "/api/user/count",
      params: params,
    })

    return res.data
  }

  static async get(id: number) {
    const res = await request({
      method: "GET",
      url: `/api/user/${id}`,
    })

    return res.data
  }

  static async me() {
    const res = await request({
      method: "GET",
      url: `/api/me`,
    })

    return res.data
  }
}
