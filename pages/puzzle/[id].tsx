import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import RoomInfo from 'components/puzzle/RoomInfo';
import Header from 'components/puzzle/Header';
import PuzzleCanvas from 'components/puzzle/PuzzleCanvas';
import Levels from 'components/puzzle/Levels';
import { usePuzzle } from 'libs/zustand/store';
import { useRouter } from 'next/router';

const Home: NextPage<{ user: UserInfo | null }> = ({ user }) => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace({
        pathname: '/',
        query: { redirect: true },
      });
    }
  }, [router, user]);

  if (!user) {
    return <div></div>;
  }

  return (
    <Container>
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
