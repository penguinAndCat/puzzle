import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import apis from 'apis';
import Seo from 'components/Seo';
import RoomInfo from 'components/puzzle/RoomInfo';
import Header from 'components/puzzle/Header';
import Levels from 'components/puzzle/Levels';
import { usePuzzle } from 'libs/zustand/store';

const PuzzleCanvas = dynamic(() => import('components/puzzle/PuzzleCanvas'), {
  ssr: false,
});

const Home: NextPage<{ user: UserInfo | null; roomInfo: RoomInfo }> = ({ user, roomInfo }) => {
  const router = useRouter();
  const { modalImage, number } = usePuzzle();
  const [showLevel, setShowLevel] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

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
      <Seo title={`${roomInfo?.title} 퍼즐 방`} description="다른 사람들과 함께 직소 퍼즐을 맞춰보세요." />
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

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  return {
    props: {
      roomInfo: (await getRoomInfo(id)) as RoomInfo,
    },
  };
};

async function getRoomInfo(id: string | string[] | undefined) {
  return await apis.puzzles.getRoomInfo(id);
}
