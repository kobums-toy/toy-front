import React, { useEffect, useState } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyles';
import RouterComponent from './routers/Router'; // Router 컴포넌트 가져오기
import { Layout } from './components/Layout';
import Header from './components/Header';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from './styles/colors';
import useMediaQuery from './hooks/useMediaQeury';
import FloatingActionButton from './components/FloatingActionButton';
import { themeModeState } from './recoil/atoms';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const themeMode = useRecoilValue(themeModeState)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(lightTheme); // 기본 테마는 라이트 모드

  useEffect(() => {
    // themeMode가 변경되면 테마를 업데이트
    if (themeMode === 'auto') {
      setTheme(prefersDarkMode ? darkTheme : lightTheme);
    } else {
      setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }
  }, [themeMode, prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Layout>
          <RouterComponent /> {/* 라우팅 컴포넌트 분리 */}
          <FloatingActionButton />
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;