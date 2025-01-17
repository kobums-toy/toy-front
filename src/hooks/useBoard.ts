import { useMutation, useQuery, useQueryClient } from "react-query"
import Board from "../models/board"

// 게시글 목록 가져오기 훅
export const useGetBoardList = (params?: any) => {
  return useQuery(["boardList", params], () => Board.find(params))
}

// 특정 게시글 가져오기 훅
export const useGetBoard = (id: number) => {
  return useQuery(["board", id], () => Board.get(id))
}

// 게시글 추가 훅
export const usePostBoard = () => {
  const queryClient = useQueryClient()
  return useMutation(Board.insert, {
    onSuccess: () => {
      queryClient.invalidateQueries("boardList") // 게시글 목록 캐시 무효화
    },
  })
}

// 게시글 업데이트 훅
export const useUpdateBoard = () => {
  const queryClient = useQueryClient()
  return useMutation(Board.update, {
    onSuccess: () => {
      queryClient.invalidateQueries("boardList")
    },
  })
}

// 게시글 삭제 훅
export const useDeleteBoard = () => {
  const queryClient = useQueryClient()
  return useMutation(Board.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries("boardList")
    },
  })
}
