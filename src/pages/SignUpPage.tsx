/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useGetUserList, usePostUser } from '../hooks/useUser';

// Sign-Up Form Styles
const formStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const titleStyle = (theme: any) => css`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${theme.mode.text}; /* 텍스트 색상은 테마에 따라 변경 */
`;

const inputStyle = css`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const buttonStyle = css`
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ab8;
  }
`;

const errorStyle = css`
  color: red;
  font-size: 0.85rem;
  margin: 10px 0;
`;

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('김땡땡');
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test1234!!');
  const [confirmPassword, setConfirmPassword] = useState('test1234!!');
  const [modalType, setModalType] = useState<'error' | 'info' | null>(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false); // Track if email is checked
  const [navigateAfterClose, setNavigateAfterClose] = useState(false);

  const { refetch: checkEmail } = useGetUserList({ email }); // Check for email existence
  const { mutate: postUser, isLoading, error } = usePostUser();

  const navigator = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailCheck = async () => {
    const { data } = await checkEmail();

    if (data && data.items.some((user: any) => user.email === email)) {
      setModalType('error');
      setModalMessage("Email is already in use.");
      setIsEmailChecked(false);
    } else {
      setModalType('info');
      setModalMessage("Email is available.");
      setIsEmailChecked(true);
    }
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = [];

    const onSuccess = () => {
      setModalType('info');
      setModalMessage('Sign-up successful!');
      setNavigateAfterClose(true); // 로그인 페이지로 이동 준비
    };

    const onError = () => {
      setModalType('error');
      setModalMessage('Sign-up failed.');
    };

    if (!validateEmail(email)) {
      validationErrors.push("Invalid email format.");
    }

    if (!validatePassword(password)) {
      validationErrors.push("Password must be at least 8 characters long and include letters, numbers, and special characters.");
    }

    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match.");
    }

    if (validationErrors.length > 0) {
      setModalType('error');
      setModalMessage(validationErrors.join('\n'));
    } else {
      postUser({ email, name, passwd: password }, { onSuccess, onError });
    }
  }

  const handleCloseModal = () => {
    setModalType(null);
    if (navigateAfterClose) {
      navigator('/login');
    }
  }

  return (
    <form css={formStyle} onSubmit={handleSubmit}>
      <>
        <h2 css={titleStyle}>Sign Up</h2>
        <input css={inputStyle} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input css={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailChecked(false);
          }} required />
          <button css={buttonStyle} type="button" onClick={handleEmailCheck}>
            Check
          </button>
        </div>
        <input css={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input css={inputStyle} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button css={buttonStyle} type="submit" disabled={isLoading || !isEmailChecked}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
        {modalType && (
          <Modal
            type={modalType}
            message={modalMessage}
            onClose={handleCloseModal}
          />
        )}
      </>
    </form>
  );
};

export default SignUpPage;