import { useMutation, useQuery, useQueryClient } from 'react-query';
import User from '../models/user';

// 유저 목록 가져오기 훅
export const useGetUserList = (params?: any, isEnabled: boolean = false) => {
  return useQuery(['userList', params], () => User.find(params), { enabled: isEnabled });
};

// 특정 유저 가져오기 훅
export const useGetUser = (id: number) => {
  return useQuery(['user', id], () => User.get(id));
};

// 유저 추가 훅
export const usePostUser = () => {
  const queryClient = useQueryClient();
  return useMutation(User.insert, {
    onSuccess: () => {
      queryClient.invalidateQueries('userList'); // 게시글 목록 캐시 무효화
    },
  });
};

// 유저 업데이트 훅
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(User.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('userList');
    },
  });
};

// 유저 삭제 훅
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(User.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('userList');
    },
  });
};

// 나의 정보
export const useGetMe = () => {
  return useQuery(['me'], () => User.me());
} 