import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import styled from 'styled-components';

import apis from 'apis';
import Header from 'components/common/Header';
import Profile from 'components/profile/Profile';
import RoomList from 'components/profile/RoomList';
import Seo from 'components/Seo';

export default function MyPage({ user }: { user: UserInfo | null }) {
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <Container>
      <Seo title={`${user?.nickname} 프로필`} description="프로필 보기 및 변경 페이지" />
      <Header user={user} />
      <Wrapper>
        <Profile user={user} />
        <RoomList user={user} />
      </Wrapper>
    </Container>
  );
}

const getPuzzle = async (userId: string) => {
  return await apis.puzzles.getPuzzleList(1, 'createdAt', 'desc', true, userId, 'userId');
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req } = ctx;
  const data = await apis.users.getAuth(req?.headers.cookie);

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery(['myPuzzle', 'createdAt', 'desc'], async () => getPuzzle(data.user.id));

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  padding: 10px;
  width: 100%;
`;
