import React, { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
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

const queryClient = new QueryClient();

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(lightTheme); // 기본 테마는 라이트 모드
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto'); // 테마 모드 상태

  useEffect(() => {
    // themeMode가 변경되면 테마를 업데이트
    if (themeMode === 'auto') {
      setTheme(prefersDarkMode ? darkTheme : lightTheme);
    } else {
      setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }
  }, [themeMode, prefersDarkMode]);

  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode); // ThemeToggleButton에서 테마 모드를 업데이트
  };

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <GlobalStyle />
          <Router>
            <Header />
            <Layout>
              <RouterComponent /> {/* 라우팅 컴포넌트 분리 */}
              <FloatingActionButton onThemeChange={handleThemeChange} />
            </Layout>
          </Router>
        </QueryClientProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;