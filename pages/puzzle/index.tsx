import type { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import PuzzleCanvas from '../../components/puzzle/PuzzleCanvas';

import { usePuzzle } from 'libs/zustand/store';
import RoomInfo from 'components/puzzle/RoomInfo';

const Home: NextPage = () => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  return (
    <Container>
      <Header setShowLevel={setShowLevel} setShowRoomInfo={setShowRoomInfo}/>
      <Levels setShowLevel={setShowLevel} showLevel={showLevel} />
      <RoomInfo setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} />
      <PuzzleCanvas puzzleLv={number} puzzleImg={modalImage} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  height: 100vh;
  position: relative;
  overflow-y: hidden;
`;
