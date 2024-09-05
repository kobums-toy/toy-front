import axios from 'axios';

// create an axios instance
const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // .env 파일에서 환경변수 가져오기
  timeout: 1000 * 60 * 10, // request timeout
});

// request interceptor
export const setAuthHeader = (token: string | null) => {
  request.interceptors.request.use(
    function (config) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      console.error('Request Error: ', error);
      return Promise.reject(error);
    }
  );
};

// response interceptor
export const setupResponseInterceptor = (onUnauthorized: () => void) => {
  request.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        onUnauthorized();
      }

      console.error('Response Error: ', error);
      return Promise.reject(error);
    }
  );
};

export default request;