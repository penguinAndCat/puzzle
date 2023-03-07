import { MouseEvent } from 'react';
import styled from 'styled-components';

import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { CloseIcon } from 'components/common/Icon';

interface ModalContainerProps {
  /**
   * 제목
   */
  title: string;
  /**
   * 모달을 켜고 닫기 위한 이름
   */
  content: string;
  /**
   * 너비
   */
  width?: number;
  /**
   * 최소 높이
   */
  height?: number;
  /**
   * 내부 컴포넌트
   */
  children?: React.ReactNode;
  /**
   * 스토리북에서 사용 유무
   */
  story?: boolean;
}

const ModalContainer = ({
  title,
  content,
  width = 300,
  height = 400,
  story = false,
  children,
}: ModalContainerProps) => {
  const { removeModal } = useModal();
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal(content);
  };

  return (
    <Container onClick={(e) => e.stopPropagation()} width={width} height={height} story={story}>
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

const Container = styled.div<{ width: number; height: number; story: boolean }>`
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
  ${({ story }) => !story && 'animation: fadein 0.5s;'}

  ${({ story }) => !story && 'position: fixed;'}
  ${({ story }) => !story && 'top: 50%;'}
  ${({ story }) => !story && 'left: 50%;'}
  ${({ story }) => !story && 'transform: translate3d(-50%, -50%, 0);'}
  width: ${({ width }) => width}px;
  min-height: ${({ height }) => height}px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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
