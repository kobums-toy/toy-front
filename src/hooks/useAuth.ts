import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import google from '../models/google';
import Kakao from '../models/kakao';
import Login from '../models/login';
import naver from '../models/naver';
import { authState, userInfoState } from '../recoil/atoms';

export const useAuth = () => {
  const setAuthState = useSetRecoilState(authState);
  const setUserInfoState = useSetRecoilState(userInfoState);
  const navigate = useNavigate();

  return useMutation(Login.login, {
    onSuccess: (data) => {
      const accessToken = data?.accessToken; // API 응답에서 accessToken 추출 (응답 형식에 맞게 수정)
      if (accessToken) {
        setAuthState({
          isAuthenticated: true,
          accessToken: accessToken,
        }); // authState에 accessToken 저장
        setUserInfoState(data.user)
        navigate('/'); // '/' 페이지로 이동
      } else {
        throw new Error(data.message);
      }
    },
  });
};

export const useKakaoAuth = () => {
  return useMutation(Kakao.kakaoLogin, {
    onSuccess: (data) => {
      console.log(data);
    },
  });
};

export const useNaverAuth = () => {
  return useMutation(naver.naverLogin, {
    onSuccess: (data) => {
      console.log(data);
    },
  });
};

export const useGoogleAuth = () => {
  return useMutation(google.googleLogin, {
    onSuccess: (data) => {
      console.log(data);
    },
  });
};