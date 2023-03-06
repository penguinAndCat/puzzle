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

interface Toast {
  /**
   * 토스트에서 강조할 닉네임
   */
  nickname?: string;
  /**
   * 토스트 내용
   */
  content: string;
  /**
   * 토스트 타입
   */
  type: 'success' | 'warning' | 'info';
  /**
   * 토스트 타입
   */
  animation?: boolean;
}

export default function Toast({ nickname, content, type, animation = true }: Toast) {
  return (
    <ToastBox animation={animation} data-testid="toast-div">
      <ToastBar type={type} />
      <div>
        <Type>{type}</Type>
        <div>
          <Nickname>{nickname}</Nickname>
          {content}
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

const ToastBox = styled.div<{ animation: boolean }>`
  zindex: 999;
  width: 240px;
  height: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;

  @keyframes fadeInToast {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    40% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fadeOutToast {
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
  ${({ animation }) => animation && 'animation-name: fadeInToast, fadeOutToast;'}
  animation-delay: 0s, 2s;
  animation-duration: 2s, 1s;

  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border-radius: 4px;
  padding: 6px 8px 6px 28px;
`;
