import Header from 'components/common/Header';
import Main from 'components/main/Main';
import Seo from 'components/Seo';
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
      <Seo
        title={'퍼즐 사이트'}
        description="원하는 사진으로 퍼즐을 생성해보세요. 그리고 친구들을 초대하여 같이 맞춰보세요."
      />
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
