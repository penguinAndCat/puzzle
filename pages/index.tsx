import Header from 'components/common/Header';
import Main from 'components/main/Main';
import type { NextPage } from 'next';
import styled from 'styled-components';

const Home: NextPage = () => {
  return (
    <Container>
      <Header />
      <Main />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
