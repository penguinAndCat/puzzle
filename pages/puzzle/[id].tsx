import type { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import PuzzleCanvas from '../../components/puzzle/PuzzleCanvas';

import { usePuzzle } from 'libs/zustand/store';

const Home: NextPage = () => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);

  return (
    <Container>
      <Header setShowLevel={setShowLevel}/>
      <Levels setShowLevel={setShowLevel} showLevel={showLevel} />
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
