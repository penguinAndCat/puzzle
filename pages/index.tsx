import Header from 'components/common/Header';
import Main from 'components/main/Main';
import { useToast } from 'hooks/useToast';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirect) {
      toast({ content: '로그인이 필요합니다', type: 'warn' });
    }
  }, []);

  return (
    <Container>
      <Header user={user} />
      <Main user={user} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
