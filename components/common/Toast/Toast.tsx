import React from 'react';
import styled from 'styled-components';

export default function Toast({ option }: { option: Toast }) {
  return (
    <ToastBox>
      <ToastBar type={option.type} />
      <Nickname>{option.nickname}</Nickname>
      <p>{option.content}</p>
    </ToastBox>
  );
}
type StyleProps = { type: 'success' | 'warn' };

const Nickname = styled.span`
  color: red;
`;

const ToastBar = styled.div<StyleProps>`
  background-color: ${({ type }) => (type === 'success' ? 'green' : type === 'warn' ? 'yellow' : 'black')};
  width: 5px;
  height: 100%;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  top: 0;
  left: 0;
`;

const ToastBox = styled.div`
  zindex: 999;
  width: 240px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;

  @keyframes fadeIn {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    40% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      line-height: 0;
      height: 0;
      opacity: 0;
      margin-bottom: 0;
    }
  }

  animation-fill-mode: forwards;
  animation-name: fadeIn, fadeOut;
  animation-delay: 0s, 2s;
  animation-duration: 2s, 1s;

  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border-radius: 4px;
  // box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
`;
