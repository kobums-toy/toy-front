toys

이 프로젝트는 React를 기반으로 소셜 로그인(Kakao, Naver, Google) 및 사용자 인증 기능을 포함하는 웹 애플리케이션입니다. 다크 모드와 라이트 모드를 지원하며, 스타일링은 Emotion 라이브러리를 사용하여 구현되었습니다.

주요 기능 1. 로그인/회원가입 기능
• 일반 사용자 계정 로그인을 지원합니다.
• 회원가입 시 이메일 중복 체크 및 비밀번호 유효성 검사를 포함합니다.
• 로그인 오류 시 사용자에게 모달을 통해 메시지를 제공합니다. 2. 소셜 로그인 (Kakao, Naver, Google)
• Kakao, Naver, Google OAuth를 통한 소셜 로그인을 지원합니다.
• 각 소셜 로그인 버튼은 각각의 스타일과 API를 통해 구현되었습니다.
• OAuth 2.0 인증 코드를 처리하여 사용자 정보를 불러옵니다. 3. 다크/라이트 모드 지원
• Emotion의 useTheme를 사용하여 테마에 따라 스타일을 변경합니다.
• 다크 모드에서는 버튼 테두리가 없고, 라이트 모드에서는 1px의 solid 테두리가 표시됩니다. 4. 사용자 관리
• React Query를 사용하여 사용자 정보 조회, 추가, 삭제, 업데이트를 관리합니다.
• Recoil을 사용해 로그인 상태 및 사용자 정보를 전역 상태로 관리합니다. 5. 에러 및 성공 모달
• 에러 메시지 또는 성공 메시지를 보여주는 재사용 가능한 모달 컴포넌트를 구현했습니다.

설치 및 실행

1. 설치

git clone <repository-url>
cd <project-directory>
npm install

2. 환경 변수 설정

.env 파일을 프로젝트 루트에 생성하고, 다음과 같이 설정합니다:

REACT_APP_KAKAO_JS_KEY=your-kakao-js-key
REACT_APP_KAKAO_REDIRECT_URL=http://localhost:3000/login
REACT_APP_NAVER_CLIENT_ID=your-naver-client-id
REACT_APP_NAVER_CLIENT_SECRET=your-naver-client-secret
REACT_APP_NAVER_REDIRECT_URL=http://localhost:3000/login
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_REDIRECT_URL=http://localhost:3000/login
REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret

3. 실행

npm start

주요 컴포넌트

1. LoginForm
   • 일반 로그인 폼 및 소셜 로그인 버튼이 포함된 컴포넌트입니다.
   • 소셜 로그인 버튼은 세로로 정렬되어 있습니다.

<LoginForm />

2. 소셜 로그인 버튼

KakaoLoginButton

<KakaoLoginButton />

    •	카카오 OAuth 2.0을 사용하여 로그인.
    •	노란색 배경과 로고가 포함된 버튼.

NaverLoginButton

<NaverLoginButton />

    •	네이버 OAuth 2.0을 사용하여 로그인.
    •	초록색 배경과 로고가 포함된 버튼.

GoogleLoginButton

<GoogleLoginButton />

    •	Google OAuth 2.0을 사용하여 로그인.
    •	흰색 배경과 Google 로고가 포함된 버튼.

3. Modal
   • 에러 및 성공 메시지를 보여주는 재사용 가능한 컴포넌트.

<Modal type="error" message="An error occurred." onClose={() => {}} />

    •	type: success 또는 error 타입 선택.
    •	message: 표시할 메시지 내용.
    •	onClose: 모달 닫기 동작.

주요 라이브러리
• React: 사용자 인터페이스를 구성.
• Emotion: CSS-in-JS 라이브러리를 사용하여 스타일링.
• React Query: 서버 상태 관리 및 API 호출.
• Recoil: 전역 상태 관리.
• React Router: 페이지 간 라우팅.
• Axios: HTTP 요청 처리.

폴더 구조

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

테마 적용

다크 모드와 라이트 모드는 Emotion의 useTheme를 사용하여 구현되었습니다. 테마를 설정하려면 ThemeProvider를 활용합니다:

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

개선 사항 1. 에러 및 로딩 핸들링:
• 네트워크 요청 실패 시 사용자 경험 향상을 위한 추가 핸들링. 2. 반응형 디자인:
• 다양한 화면 크기에 맞춰 디자인을 최적화. 3. 테스트:
• 컴포넌트와 API 요청에 대한 단위 테스트 추가.
