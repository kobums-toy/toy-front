toys

React를 기반으로 소셜 로그인(Kakao, Naver, Google) 및 사용자 인증 기능을 포함하는 웹 애플리케이션입니다.
다크 모드와 라이트 모드를 지원하며, Emotion 라이브러리를 활용하여 스타일링을 구현했습니다.

주요 기능

1. 로그인/회원가입 기능
   • 일반 사용자 계정 로그인 및 회원가입을 지원합니다.
   • 이메일 중복 확인 및 비밀번호 유효성 검사를 제공합니다.
   • 로그인 실패 시 에러 모달을 통해 사용자에게 메시지를 제공합니다.

2. 소셜 로그인
   • Kakao, Naver, Google OAuth를 통한 소셜 로그인 지원.
   • 각 소셜 로그인 버튼은 Emotion으로 커스터마이징된 디자인 적용.
   • OAuth 인증 코드를 처리하여 사용자 정보를 가져옵니다.

3. 다크/라이트 모드 지원
   • 테마에 따라 동적으로 스타일 변경:
   • 다크 모드: 테두리 제거.
   • 라이트 모드: 1px solid 테두리 적용.

4. 사용자 관리
   • React Query를 활용하여 사용자 정보 조회, 추가, 삭제, 업데이트.
   • Recoil을 사용해 로그인 상태 및 사용자 정보를 전역으로 관리.

5. 에러 및 성공 모달
   • 에러 모달: 오류 상황에 대한 정보를 사용자에게 표시.
   • 성공 모달: 작업 완료 알림 및 후속 액션 제공.

설치 및 실행

1. 설치

git clone <repository-url>
cd <project-directory>
npm install

2. 환경 변수 설정

.env 파일을 생성하고 아래 환경 변수를 추가하세요:

REACT_APP_KAKAO_JS_KEY=your-kakao-js-key
REACT_APP_KAKAO_REDIRECT_URL=http://localhost:3000/login
REACT_APP_NAVER_CLIENT_ID=your-naver-client-id
REACT_APP_NAVER_CLIENT_SECRET=your-naver-client-secret
REACT_APP_NAVER_REDIRECT_URL=http://localhost:3000/login
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret
REACT_APP_GOOGLE_REDIRECT_URL=http://localhost:3000/login

3. 실행

npm start

주요 컴포넌트

LoginForm

로그인 폼과 소셜 로그인 버튼이 포함된 컴포넌트입니다.
소셜 로그인 버튼은 세로로 정렬되어 있습니다.

<LoginForm />

소셜 로그인 버튼

KakaoLoginButton
• 카카오 OAuth 2.0을 사용하여 로그인.
• 노란색 배경과 로고를 포함한 디자인.

<KakaoLoginButton />

NaverLoginButton
• 네이버 OAuth 2.0을 사용하여 로그인.
• 초록색 배경과 로고를 포함한 디자인.

<NaverLoginButton />

GoogleLoginButton
• Google OAuth 2.0을 사용하여 로그인.
• 흰색 배경과 Google 로고를 포함한 디자인.

<GoogleLoginButton />

Modal

에러 및 성공 메시지를 표시하는 재사용 가능한 컴포넌트입니다.

<Modal type="error" message="An error occurred." onClose={() => {}} />

    •	Props:
    •	type: 'success' | 'error'
    •	message: 표시할 메시지.
    •	onClose: 모달 닫기 동작.

테마 적용

Emotion의 useTheme를 사용하여 다크 모드와 라이트 모드를 지원합니다.
테마 설정 예시는 아래와 같습니다:

import { ThemeProvider } from '@emotion/react';

const lightTheme = {
mode: 'light',
text: '#000',
background: '#fff',
};

const darkTheme = {
mode: 'dark',
text: '#fff',
background: '#000',
};

function App() {
const [theme, setTheme] = useState(lightTheme);

return (
<ThemeProvider theme={theme}>
<LoginForm />
</ThemeProvider>
);
}

폴더 구조
<file />
src/
│
├── components/
│ ├── LoginForm.tsx
│ ├── Modal.tsx
│ ├── KakaoLoginButton.tsx
│ ├── NaverLoginButton.tsx
│ ├── GoogleLoginButton.tsx
│
├── hooks/
│ ├── useAuth.ts
│ ├── useUser.ts
│
├── models/
│ ├── user.ts
│ ├── board.ts
│
├── recoil/
│ ├── atoms.ts
│
├── styles/
│ ├── colors.ts
│
├── App.tsx
│
└── index.tsx

개선 사항 1. UX 향상:
• 로딩 상태에서 버튼에 스피너 추가.
• 성공/에러 모달의 디자인 개선. 2. 반응형 디자인:
• 모바일과 데스크톱 환경 모두에서 UI 최적화. 3. 테스트:
• 단위 테스트 및 통합 테스트 추가.
