import { useState } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import { usePuzzle } from 'libs/zustand/store';
import RoomInfo from 'components/puzzle/RoomInfo';
import Header from 'components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import Seo from 'components/Seo';

const PuzzleCanvas = dynamic(() => import('components/puzzle/PuzzleCanvas'), {
  ssr: false,
});

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  return (
    <Container>
      <Seo title={`혼자하기 퍼즐 방`} description="직소 퍼즐을 맞춰보세요." />
      <Header setShowLevel={setShowLevel} setShowRoomInfo={setShowRoomInfo} user={user} />
      <Levels setShowLevel={setShowLevel} showLevel={showLevel} />
      <RoomInfo setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} user={user} />
      <PuzzleCanvas puzzleLv={number} puzzleImg={modalImage} user={user} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  height: 100vh;
  position: relative;
  overflow-y: hidden;
`;
