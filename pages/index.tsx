import Header from 'components/common/Header';
import Main from 'components/main/Main';
import { userStore } from 'libs/zustand/store';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import styled from 'styled-components';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const { setUser } = userStore();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);
  return (
    <Container>
      <Header user={user} />
      <Main />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
