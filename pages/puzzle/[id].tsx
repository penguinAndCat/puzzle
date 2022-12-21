import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import PuzzleCanvas from '../../components/puzzle/PuzzleCanvas';

import { usePuzzle } from 'libs/zustand/store';
import RoomInfo from 'components/puzzle/RoomInfo';
import axios from 'libs/axios';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  return (
    <Container>
      <Header setShowLevel={setShowLevel} setShowRoomInfo={setShowRoomInfo} user={user} />
      <Levels setShowLevel={setShowLevel} showLevel={showLevel} />
      <RoomInfo setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} user={user} />
      <PuzzleCanvas puzzleLv={number} puzzleImg={modalImage} user={user} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { data } = await axios.get('http://localhost:3000/api/auth', {
    headers: {
      Cookie: req.headers.cookie || '',
    },
  });
  if (req?.url?.startsWith('/_next')) {
    return {
      props: {
        user: null,
      },
    };
  }
  return {
    props: {
      user: data?.user || null,
    },
  };
};

export default Home;

const Container = styled.div`
  height: 100vh;
  position: relative;
  overflow-y: hidden;
`;
