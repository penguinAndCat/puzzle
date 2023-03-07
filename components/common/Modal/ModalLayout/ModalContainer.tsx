import { MouseEvent } from 'react';
import styled from 'styled-components';

import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { CloseIcon } from 'components/common/Icon';

interface ModalContainerProps {
  /**
   * Modal title
   */
  title: string;
  /**
   * Modal content name
   */
  content: string;
  /**
   * Modal min-width
   */
  width?: number;
  /**
   * Modal min-height
   */
  height?: number;
  /**
   * Modal main components
   */
  children?: React.ReactNode;
}

const ModalContainer = ({ title, content, width = 300, height = 400, children }: ModalContainerProps) => {
  const { removeModal } = useModal();
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal(content);
  };

  return (
    <Container onClick={(e) => e.stopPropagation()} width={width} height={height}>
      <TitleWrapper>
        <Div />
        <Title>{title}</Title>
        <Close onClick={(e) => closeModal(e)}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      {children}
    </Container>
  );
};

export default ModalContainer;

const Container = styled.div<{ width: number; height: number }>`
  @keyframes fadein {
    0% {
      transform: scale(1);
      opacity: 0;
      transform: translate3d(-50%, -100%, 0);
    }
    50% {
      transform: scale(1);
      opacity: 1;
      transform: translate3d(-50%, -45%, 0);
    }
    100% {
      transform: scale(1);
      opacity: 1;
      transform: translate3d(-50%, -50%, 0);
    }
  }
  animation: fadein 0.5s;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  min-width: ${({ width }) => width}px;
  min-height: ${({ height }) => height}px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 2px ${({ theme }) => theme.modalTextColor};
`;

const Title = styled.div``;

const Div = styled.div`
  width: 30px;
  height: 30px;
`;

const Close = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;
  ${theme.common.flexCenter};
`;
