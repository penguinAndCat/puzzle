import { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { QueryClient, dehydrate } from 'react-query';

import Header from 'components/common/Header';
import Main from 'components/main/Main';
import Seo from 'components/Seo';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirect) {
      toast({ content: '로그인이 필요합니다', type: 'warning' });
    }
  }, []);

  return (
    <Container>
      <Seo
        title={'퍼즐 사이트'}
        description="원하는 사진으로 퍼즐을 생성해보세요. 그리고 친구들을 초대하여 같이 맞춰보세요."
      />
      <Header user={user} />
      <Main />
    </Container>
  );
};

export default Home;

const getPuzzleList = async () => {
  return await apis.puzzles.getPuzzleList(1, 'createdAt', 'desc', true);
};

const getPopularPuzzleList = async () => {
  return await apis.puzzles.getPopularPuzzleList();
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(['public', 'createdAt', 'desc', 'true'], getPuzzleList);
  await queryClient.prefetchQuery(['popularPuzzle'], getPopularPuzzleList);

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
