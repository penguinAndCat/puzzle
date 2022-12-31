import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import RoomInfo from 'components/puzzle/RoomInfo';
import Header from 'components/puzzle/Header';
import PuzzleCanvas from 'components/puzzle/PuzzleCanvas';
import Levels from 'components/puzzle/Levels';
import { usePuzzle } from 'libs/zustand/store';
import { useToast } from 'hooks/useToast';
import { useRouter } from 'next/router';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const { fireToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      fireToast({ content: '로그인이 필요합니다.', top: 100 });
      router.replace('/');
    }
  }, [fireToast, router, user]);

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
