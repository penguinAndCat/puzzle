import Header from 'components/common/Header';
import Main from 'components/main/Main';
import axios from 'libs/axios';
import { userStore } from 'libs/zustand/store';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const response = await axios.get('/api/auth');
//   const data = response.data.user;
//   return {
//     props: {
//       user: data || null,
//     },
//   };
// };

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
