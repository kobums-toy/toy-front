/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const modalStyle = (type: "error" | "info") => css`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  color: ${type === "error" ? "red" : "#4a90e2"};
`

const buttonStyle = css`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ab8;
  }
`

interface ModalProps {
  type: "error" | "info"
  message: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ type, message, onClose }) => {
  return (
    <div css={overlayStyle} onClick={onClose}>
      <div css={modalStyle(type)} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button css={buttonStyle} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal
