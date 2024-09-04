import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/atoms';

const login = async (credentials: { username: string; password: string }) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const useAuth = () => {
  const setAuthState = useSetRecoilState(authState);

  return useMutation(login, {
    onSuccess: () => {
      setAuthState(true);
    },
  });
};