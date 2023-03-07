import { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import ModalContainer from './ModalContainer';
import { useModal } from 'libs/zustand/store';

interface Props {
  /**
   * Modal title
   */
  title: string;
  /**
   * zustand와 연동하여 content와 일치하는 모달을 보여준다.
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

const ModalLayout = ({ title, content, width = 300, height = 400, children }: Props) => {
  const { modal, removeModal } = useModal();
  const [isBrowser, setIsBrowser] = useState(false);

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal(content);
  };

  useEffect(() => {
    setIsBrowser(true);
    document.body.style.overflow = 'hidden';
    return () => {
      if (modal.length === 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  const modalRootElement = document.getElementById('modal-root');
  const modalContent = (
    <OuterContainer onClick={(e) => closeModal(e)}>
      <ModalContainer title={title} content={content} width={width} height={height}>
        {children}
      </ModalContainer>
    </OuterContainer>
  );
  if (isBrowser) {
    if (modalRootElement) {
      return createPortal(modalContent, modalRootElement);
    }
  }
  return null;
};

export default ModalLayout;

const OuterContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 100;
`;
