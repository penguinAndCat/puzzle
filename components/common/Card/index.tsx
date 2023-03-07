import React, { useState } from 'react';
import styled from 'styled-components';

import { theme } from 'libs/theme/theme';
import { SeeMoreIcon } from '../Icon';
import HoverImage from './HoverImage';
import ProgressBar from './ProgressBar';
import { useModal } from 'libs/zustand/store';

interface CardProps {
  /**
   * 카드 이미지 url
   */
  src: string;
  /**
   * 퍼즐 완성도(%)
   */
  progress: number;
  /**
   * 퍼즐 방 제목
   */
  title: string;
  /**
   * 퍼즐 방 아이디
   */
  puzzleId: string;
  /**
   * 비밀방 유무
   */
  isPrivate?: boolean;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick: () => void;
  /**
   * 삭제 이벤트 핸들러
   */
  onDelete?: () => void;
  /**
   * 메인 페이지에서 사용하는지 여부
   */
  isMain?: boolean;
  /**
   * 퍼즐 조각 개수
   */
  puzzleNumber?: number;
  /**
   * 카드 너비, 미지정시 100%
   *
   * 100%인 경우 카드 배치 시 grid 사용에 따라 화면 크기 1024px 이상에서 카드 너비 250px,
   * 미만일 경우 화면 크기에 따라 줄어듬
   */
  width?: number;
}

export default function Card({
  src,
  progress,
  title,
  puzzleId,
  isPrivate = false,
  onClick,
  onDelete,
  isMain = false,
  puzzleNumber,
  width = undefined,
}: CardProps) {
  const { addModal, setPuzzleId } = useModal();
  const [showDelete, setShowDelete] = useState(false);

  const openModal = () => {
    addModal('invitedUser');
    setPuzzleId(puzzleId);
  };

  return (
    <>
      <Container onClick={onClick} width={width}>
        <HoverImage
          src={src}
          alt={title}
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
            {isPrivate && <ClickableP onClick={openModal}>참가자 명단</ClickableP>}
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
            <div>
              <Info>{puzzleNumber}조각</Info>
            </div>
          </TextWrapper>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div<{ width?: number }>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
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
  width: 100%;
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
`;

const PrivateP = styled.p`
  min-width: 40px;
  font-size: 12px;
  margin: 0 8px 2px 0;
  color: #969696;
`;

const ClickableP = styled.p`
  font-size: 12px;
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

const Info = styled.div`
  font-size: 12px;
`;
