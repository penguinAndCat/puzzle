import { useModal } from 'libs/zustand/store';
import { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  content: string;
  setCloseModal?: () => void;
}

const ModalLayout = ({ content, children, setCloseModal }: Props) => {
  const { modal, removeModal } = useModal();
  const [isBrowser, setIsBrowser] = useState(false);

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal(content);
    if (setCloseModal === undefined) return;
    setCloseModal();
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
  const modalContent = <OuterContainer onClick={(e) => closeModal(e)}>{children}</OuterContainer>;
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
