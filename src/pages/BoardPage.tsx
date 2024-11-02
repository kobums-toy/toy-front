/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostBoard } from '../hooks/useBoardForm';
import { primaryColor, primaryColorHover } from '../styles/colors';

const formStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const inputStyle = css`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const textareaStyle = css`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  min-height: 150px;
`;

const imagePreviewStyle = css`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const buttonStyle = css`
  padding: 10px;
  background-color: ${primaryColor};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${primaryColorHover};
  }
`;

const BoardForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate } = usePostBoard();
  const navigator = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('img', image);

    mutate(formData, {
      onSuccess: () => {
        alert('게시글이 성공적으로 작성되었습니다.');
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        navigator('/')
      },
      onError: () => {
        alert('게시글 작성에 실패했습니다.');
      },
    });
  };

  return (
    <form css={formStyle} onSubmit={handleSubmit}>
      <h2>게시글 작성</h2>
      <input
        css={inputStyle}
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        css={textareaStyle}
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        css={inputStyle}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imagePreview && <img src={imagePreview} alt="Preview" css={imagePreviewStyle} />}
      <button css={buttonStyle} type="submit">
        작성 완료
      </button>
    </form>
  );
};

export default BoardForm;