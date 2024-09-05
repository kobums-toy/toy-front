import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import request from '../global/request';
import { authState } from '../recoil/atoms';

const login = async (item: any) => {
  const res = await request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: item,
  });

  return res
};

export const useAuth = () => {
  const setAuthState = useSetRecoilState(authState);

  return useMutation(login, {
    onSuccess: () => {
      setAuthState(true);
    },
  });
};