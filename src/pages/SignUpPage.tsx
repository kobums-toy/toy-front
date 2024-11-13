/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePostUser } from '../hooks/useUser';

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

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const { mutate: postUser, isLoading, error } = usePostUser();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = [];

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
      setErrors(validationErrors);
    } else {
      setErrors([]);
      postUser({ email, name, passwd: password });
    }
  }

  return (
    <form css={formStyle} onSubmit={handleSubmit}>
      <h2 css={titleStyle}>Sign Up</h2>
      <input css={inputStyle} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input css={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input css={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input css={inputStyle} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button css={buttonStyle} type="submit" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
    </form>
  );
};

export default SignUpPage;