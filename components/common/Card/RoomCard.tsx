import axios from 'libs/axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SeeMoreIcon } from '../Icon';
import HoverImage from './HoverImage';
import ProgressBar from './ProgressBar';

export default function RoomCard({
  src,
  progress,
  title,
  puzzleId,
  isPrivate = false,
  userId,
  onClick,
  onDelete,
  isMain = false,
}: {
  src: string;
  progress: number;
  title: string;
  puzzleId: string;
  userId: string | undefined;
  isPrivate?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  isMain?: boolean;
}) {
  const [userList, setUserList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const openModal = (data: any[], title: string) => {
    setModalData(data);
    setModalTitle(title);
    setShowModal(true);
  };
  const closeModal = () => {
    setModalData([]);
    setShowModal(false);
  };

  useEffect(() => {
    axios.get(`/api/puzzle/users/${puzzleId}?userId=${userId}`).then((res) => setUserList(res.data.data.users));
  }, [puzzleId, userId]);

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
          <Title>
            <span>{title}</span>
          </Title>
          <TextWrapper>
            <div style={{ height: '10px', width: '100%' }}>
              <ProgressBar percent={progress} />
            </div>
            {!isMain && <p>{isPrivate ? '비밀방' : '공개방'}</p>}
            {isPrivate && <ClickableP onClick={() => openModal(userList, '초대받은 사람')}>초대받은 사람</ClickableP>}
            {onDelete && (
              <DeleteContainer>
                <ToggleButton onClick={() => setShowDelete((prev) => !prev)}>
                  <SeeMoreIcon />
                </ToggleButton>
                {showDelete && (
                  <DeleteWrapper>
                    <DeleteButton onClick={onDelete}>방 삭제</DeleteButton>
                  </DeleteWrapper>
                )}
              </DeleteContainer>
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
              return (
                <UserWrapper key={index}>
                  <Img src={item.picture} alt={item.nickname} />
                  <Nickname>{item.nickname}</Nickname>
                </UserWrapper>
              );
            })}
          </ModalListWrapper>
        </OverflowWrapper>
      </ModalContainer>
    </ModalWindow>
  );
};

const UserWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 0.25rem;
  border-bottom: 1px solid lightgray;
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 8px;
`;

const Nickname = styled.div`
  width: 100px;
  margin-right: 8px;
  font-size: 12px;
`;

const ModalWindow = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
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
  border-bottom: 1px solid gray;
`;

const ModalListWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  position: relative;
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
  width: 200px;
  font-weight: bold;
  text-align: left;
  font-size: 1.25rem;
  padding: 0.5rem;
  display: flex;
  overflow: hidden;
  & > span {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 1080px) {
    width: 160px;
  }
  @media (max-width: 870px) {
    width: 120px;
  }
  @media (max-width: 720px) {
    width: 280px;
  }
  @media (max-width: 600px) {
    width: 220px;
  }
  @media (max-width: 480px) {
    width: 160px;
  }
  @media (max-width: 360px) {
    width: 100px;
  }
`;

const ClickableP = styled.p`
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
`;

const ToggleButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  padding: 0px;
  background-color: rgba(256, 256, 256, 0.3);
  &:hover {
    background-color: rgba(256, 256, 256, 0);
  }
  cursor: pointer;
`;

const DeleteContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const DeleteButton = styled.button`
  width: 60px;
  height: 30px;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: rgba(256, 256, 256, 1);
`;

const DeleteWrapper = styled.div`
  position: absolute;
  right: 0;
`;
