/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useDeleteBoard, usePostBoard, useUpdateBoard } from '../hooks/useBoard';
import { BoardItem, initBoard } from '../models/board';
import { userInfoState } from '../recoil/atoms';
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

const BoardInseartPage: React.FC = () => {
  const [board, setBoard] = useState<BoardItem>(initBoard);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const userInfo = useRecoilValue(userInfoState)

  const { mutate: createBoard } = usePostBoard();
  const { mutate: updateBoard } = useUpdateBoard();
  const { mutate: deleteBoard } = useDeleteBoard();
  const navigator = useNavigate();

  const location = useLocation();
  // useEffect(() => {
  //   board.user = userInfo.id
  // }, [])

  useEffect(() => {
    if (location.state) {
      setBoard(location.state);
    } else {
      setBoard((prevBoard) => ({
        ...prevBoard,
        user: userInfo.id
      }))
    }
    if (location.state && location.state.img) {
      setImagePreview(location.state.img); // Set initial image preview in edit mode
    }
  }, [location, userInfo.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setBoard({ ...board, img: file.name })
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitBoard = { ...board };
    if (image) submitBoard.img = image.name;

    const onSuccess = () => {
      alert(`게시글이 성공적으로 ${location.state ? '수정' : '작성'}되었습니다.`);
      navigator('/board');
    };

    const onError = () => {
      alert(`게시글 ${location.state ? '수정' : '작성'}에 실패했습니다.`);
    };

    if (location.state) {
      updateBoard(submitBoard, { onSuccess, onError });
    } else {
      createBoard(submitBoard, { onSuccess, onError });
    }
  };

  const handleDelete = () => {
    const onSuccess = () => {
      alert(`게시글이 성공적으로 삭제되었습니다.`);
      navigator('/board');
    };

    const onError = () => {
      alert(`게시글 삭제에 실패했습니다.`);
    };

    deleteBoard(board, { onSuccess, onError })
  };

  return (
    <>
      <form css={formStyle} onSubmit={handleSubmit}>
        <h2>게시글 작성</h2>
        <input
          css={inputStyle}
          type="text"
          placeholder="제목"
          value={board.title}
          onChange={(e) => setBoard((curBoard) => {
            return {
              ...curBoard,
              title: e.target.value,
            }
          })}
          required
        />
        <textarea
          css={textareaStyle}
          placeholder="내용을 입력하세요"
          value={board.content}
          onChange={(e) => setBoard((curBoard) => {
            return {
              ...curBoard,
              content: e.target.value,
            }
          })}
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
      <button css={buttonStyle} onClick={handleDelete}>삭제</button>
    </>
  );
};

export default BoardInseartPage;