import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import { authTokenState } from '../recoil/atoms'; // Recoil의 토큰 상태
// import { setAuthHeader, setupResponseInterceptor } from '../global/request'; // Axios 설정 파일
import { HomePage } from '../pages/HomePage';

const RouterComponent: React.FC = () => {
  const [authToken, setAuthToken] = useRecoilState(authTokenState); // Recoil에서 토큰 상태 관리
  const navigate = useNavigate(); // React Router의 navigate 함수

  useEffect(() => {
    // Recoil의 authToken 값을 기반으로 Authorization 헤더 설정
    // setAuthHeader(authToken);

    // 401 에러 시 로그아웃 및 리다이렉트 처리
    // setupResponseInterceptor(() => {
    //   setAuthToken(null); // Recoil 상태 초기화
    //   // navigate('/login'); // 로그인 페이지로 이동
    //   navigate('/')
    // });
  }, [authToken, navigate, setAuthToken]);

  return (
    <Routes>
      {/* 기본 경로에 대해 로그인 페이지로 리다이렉트 */}
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route path="/" element={<HomePage />} />
      {/* 로그인 페이지 경로 */}
      <Route path="/login" element={<LoginPage />} />
      {/* 대시보드 경로 (로그인 후 접근) */}
      {/* <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/login" />} /> */}
      {/* 404 페이지 경로 */}
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RouterComponent;