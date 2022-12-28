import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HoverImage from './HoverImage';

export default function RoomCard({
  src,
  currentPlayer,
  maxPlayer,
  progress,
  title,
  isPrivate = false,
  onClick,
  participantList,
  invitedList,
}: {
  src: string;
  currentPlayer: number;
  maxPlayer: number;
  progress: number;
  title: string;
  isPrivate?: boolean;
  invitedList?: any[];
  participantList?: any[];
  onClick: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const openModal = (data: any[], title: string) => {
    setModalData(data);
    setModalTitle(title);
    setShowModal(true);
  };
  const closeModal = () => {
    setModalData([]);
    setShowModal(false);
  };
  return (
    <>
      <Container onClick={onClick}>
        <HoverImage
          src={src}
          alt="test"
          width={`100%`}
          style={{ objectFit: 'cover', aspectRatio: 1, cursor: 'pointer' }}
        />
        <div onClick={(e) => e.stopPropagation()}>
          <Title>{title}</Title>
          <TextWrapper>
            <p>{`${currentPlayer}/${maxPlayer}`}</p>
            <p>{`${progress}%`}</p>
            <ClickableP onClick={() => openModal(participantList || [], '참가한 사람')}>참가한 사람</ClickableP>
            {isPrivate && (
              <>
                <ClickableP onClick={() => openModal(invitedList || [], '초대받은 사람')}>초대받은 사람</ClickableP>
              </>
            )}
          </TextWrapper>
        </div>
      </Container>
      {showModal && <UserListModal data={modalData} handleClose={closeModal} title={modalTitle} />}
    </>
  );
}

const UserListModal = ({ data, handleClose, title }: { data: any[]; handleClose: () => void; title: string }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  });

  return (
    <ModalWindow onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <OverflowWrapper>
          <ModalListWrapper>
            {data.map((item: any, index: number) => {
              return <li key={index}>{item}</li>;
            })}
          </ModalListWrapper>
        </OverflowWrapper>
      </ModalContainer>
    </ModalWindow>
  );
};

const ModalWindow = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 250px;
  height: 50%;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const OverflowWrapper = styled.div`
  overflow-y: auto;
  width: 100%;
`;

const ModalTitle = styled.h1`
  padding: 0.25rem;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5;
  text-align: center;
  border-bottom: 1px solid lightgray;
`;

const ModalListWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ModalListItem = styled.li`
  padding: 0.25rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  border-bottom: 1px solid lightgray;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  color: black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const TextWrapper = styled.div`
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: left;
  font-size: 1.25rem;
  padding: 0.5rem;
`;

const ClickableP = styled.p`
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
`;
