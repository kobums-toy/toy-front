import React from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyles';
import RouterComponent from './routers/Router'; // Router 컴포넌트 가져오기

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Router>
          <RouterComponent /> {/* 라우팅 컴포넌트 분리 */}
        </Router>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;