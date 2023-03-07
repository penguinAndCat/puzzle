import React from 'react';
import styled from 'styled-components';
import { ModalButton } from '../Button';

export const Ul = styled.ul<{ height?: number }>`
  height: ${({ height }) => (height ? height : 370)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #cccccc;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
`;

export const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

export const Li = styled.li`
  width: 300px;
  min-height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Nickname = styled.div`
  width: 120px;
  font-size: 12px;
`;

export const Button = ({ children, ...props }: { children?: React.ReactNode; onClick?: () => void }) => {
  return (
    <ModalButton buttonType="modalUser" {...props}>
      {children}
    </ModalButton>
  );
};

export const Div = styled.div`
  width: 70px;
  height: 24px;
  font-size: 12px;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  text-align: center;
  line-height: 20px;
  border-radius: 2px;
`;

export const NoData = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;
