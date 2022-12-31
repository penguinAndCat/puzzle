import React from 'react';
import styled from 'styled-components';

const TYPE = {
  success: {
    color: '#0ED73F',
  },
  warning: {
    color: '#E3E60E',
  },
  info: {
    color: '#0E42E6',
  },
};

export default function Toast({ option }: { option: Toast }) {
  return (
    <ToastBox>
      <ToastBar type={option.type} />
      <div>
        <Type>{option.type}</Type>
        <div>
          <Nickname>{option.nickname}</Nickname>
          {option.content}
        </div>
      </div>
    </ToastBox>
  );
}
type StyleProps = { type: 'success' | 'warning' | 'info' };

const Nickname = styled.span`
  color: red;
`;

const Type = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ToastBar = styled.div<StyleProps>`
  background-color: ${({ type }) => TYPE[type].color};
  width: 7px;
  height: 100%;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  top: 0;
  left: 0;
`;

const ToastBox = styled.div`
  zindex: 999;
  width: 100%;
  height: 100%;
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
  padding: 6px 8px 6px 28px;
  // box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
`;
