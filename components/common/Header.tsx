import { theme } from 'libs/theme/theme';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import Palette from './Palette';

const Header = () => {
  const { data: session, status } = useSession();
  return (
    <Container>
      <Wrapper>
        <Left>
          <Button>메뉴</Button>
        </Left>
        <Bar />
        <Logo>
          <div>PENGCAT</div>
          <div>PUZZLE</div>
        </Logo>
        <Bar />
        <Right>
          <Button>
            {status === 'authenticated' ? (
              <span onClick={() => signOut()}>{session.user.name}</span>
            ) : (
              <span onClick={() => signIn('kakao')}>로그인</span>
            )}
          </Button>
          <Palette />
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 60px;
  border-bottom: 3px ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.headerColor};
  @media (max-width: 720px) {
    padding: 20px 20px;
  }
  @media (max-width: 600px) {
    padding: 20px 10px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  min-width: 130px;
  display: flex;
  margin-right: 80px;
  @media (max-width: 900px) {
    margin-right: 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Logo = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 0 80px;
  font-weight: 600;
  color: ${({ theme }) => theme.headerTextColor};
  cursor: pointer;
  @media (max-width: 900px) {
    margin: 0 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Bar = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  background-image: linear-gradient(transparent 50%, ${({ theme }) => theme.headerTextColor} 50%);
  background-size: 12px 12px;
  @media (max-width: 720px) {
    display: none;
  }
`;

const Right = styled.div`
  min-width: 130px;
  ${theme.common.flexCenter};
  margin-left: 80px;
  @media (max-width: 900px) {
    margin-left: 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Button = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;
