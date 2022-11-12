import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import PuzzleCanvas from '../../components/puzzle/PuzzleCanvas';

import { exportLevels } from '../../libs/puzzle/createPuzzle';
import { usePuzzle } from 'libs/zustand/store';

const Home: NextPage = () => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);

  return (
    <Container onClick={() => setShowLevel(false)}>
      <Header setShowLevel={setShowLevel} showLevel={showLevel} />
      <Levels setShowLevel={setShowLevel} showLevel={showLevel} />
      <PuzzleCanvas puzzleLv={number} puzzleImg={modalImage} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  position: relative;
  overflow-y: hidden;
`;
