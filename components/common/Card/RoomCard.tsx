import axios from 'libs/axios';
import { theme } from 'libs/theme/theme';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SeeMoreIcon } from '../Icon';
import InvitedUserModal from '../Modal/InvitedUserModal';
import ModalLayout from '../Modal/ModalLayout';
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
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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
          <TitleWrapper>
            <Title>
              <span>{title}</span>
            </Title>
            {!isMain && <PrivateP>{isPrivate ? '비밀방' : '공개방'}</PrivateP>}
          </TitleWrapper>
          <TextWrapper>
            <div style={{ height: '10px', width: '100%' }}>
              <ProgressBar percent={progress} />
            </div>
            {isPrivate && <ClickableP onClick={() => setShowModal(true)}>참가자 명단</ClickableP>}
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
      {showModal && (
        <ModalLayout content={'invitedUser'} setCloseModal={() => setShowModal(false)}>
          <InvitedUserModal puzzleId={puzzleId} setCloseModal={() => setShowModal(false)} />
        </ModalLayout>
      )}
    </>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  color: ${theme.colors.dark};
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

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
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

const PrivateP = styled.p`
  font-size: 12px;
  margin: 0 2px 2px 0;
  color: #969696;
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
