import React from 'react';
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
}: {
  src: string;
  currentPlayer: number;
  maxPlayer: number;
  progress: number;
  title: string;
  isPrivate?: boolean;
  onClick: () => void;
}) {
  return (
    <Container onClick={onClick}>
      <HoverImage src={src} alt="test" width={`100%`} style={{ objectFit: 'cover', aspectRatio: 1 }} />
      <TextWrapper>
        <Title>{title}</Title>
        <p>{`${currentPlayer}/${maxPlayer}`}</p>
        <p>{`${progress}%`}</p>
      </TextWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: white;
  color: ${({ theme }) => theme.modalTextColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const TextWrapper = styled.div`
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
  text-align: right;
`;

const Title = styled.h1`
  font-weight: bold;
  text-align: left;
`;
