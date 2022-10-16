import { useModal } from 'libs/zustand/store';
import { MouseEvent, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  content: string;
}

const ModalLayout = ({ content, children }: Props) => {
  const { modal, removeModal } = useModal();

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal(content);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      if (modal.length === 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  return <OuterContainer onClick={(e) => closeModal(e)}>{children}</OuterContainer>;
};

export default ModalLayout;

const OuterContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;
