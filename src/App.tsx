import React from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginPage from './pages/LoginPage';
import GlobalStyle from './styles/GlobalStyles';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <LoginPage />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;