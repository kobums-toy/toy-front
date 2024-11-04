import request from '../global/request'


export const initBoard = {
  id: 0,
  title: '',
  content: '',
  img: '',
  user: 0,
  date: '',
}

export interface BoardItem {
  id: number;
  title: string;
  content: string;
  img: string;
  user: number;
  date: string;
}

export interface BoardReturn {
  id: number;
  title: string;
  content: string;
  img: string;
  user: number;
  date: string;
  extra: object;
}

export default class Board {
  static async insert(item: any) {
    const res = await request({
      method: 'POST',
      url: '/api/board',
      data: item
    })

    return res.data
  }

  static async update(item: any) {
    const res = await request({
      method: 'PUT',
      url: '/api/board',
      data: item
    })

    return res.data
  }

  static async remove(item: any) {
    const res = await request({
      method: 'DELETE',
      url: '/api/board',
      data: item
    })

    return res.data
  }

  static async find(params: any) {
    const res = await request({
      method: 'GET',
      url: '/api/board',
      params: params
    })

    if (res.data.items == null) {
      res.data.items = []
    }

    return res.data
  }

  static async count(params: any) {
    const res = await request({
      method: 'GET',
      url: '/api/board/count',
      params: params
    })

    return res.data
  }

  static async get(id: number) {
    const res = await request({
      method: 'GET',
      url: `/api/board/${id}`
    })

    return res.data
  }
}
