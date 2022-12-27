import Header from 'components/common/Header';
import Main from 'components/main/Main';
import { NEXT_SERVER } from 'config';
import { setCookie } from 'cookies-next';
import axios from 'libs/axios';
import type { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  return (
    <Container>
      <Header user={user} />
      <Main />
    </Container>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { data } = await axios.get(`${NEXT_SERVER}/api/auth`, {
    headers: {
      Cookie: req.headers.cookie || '',
    },
  });
  if (data.accessToken) {
    setCookie('accessToken', data.accessToken, { req, res });
  }
  if (req?.url?.startsWith('/_next')) {
    return {
      props: {
        user: null,
      },
    };
  }
  return {
    props: {
      user: data?.user || null,
    },
  };
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
