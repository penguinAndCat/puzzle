import styled from 'styled-components';
import { useModal } from 'libs/zustand/store';
import { useNotice } from 'hooks/useNotice';
import Palette from '../Palette';
import Menu from './Menu';

const Header = ({ user }: { user: UserInfo | null }) => {
  const { addModal } = useModal();
  const { data, refetch } = useNotice(user);

  return (
    <Container>
      <Wrapper>
        {user?.name ? (
          <Left>
            <Button onClick={() => addModal('friend')}>친구</Button>
            <Button onClick={() => addModal('notice')}>
              알림
              {data && data.length > 0 && <Notice />}
            </Button>
          </Left>
        ) : (
          <Left />
        )}
        <Bar />
        <Logo onClick={() => (window.location.href = '/')}>
          <div>PENGCAT</div>
          <div>PUZZLE</div>
        </Logo>
        <Bar />
        <Right>
          <Menu user={user} />
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
    padding: 10px 10px;
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
  min-width: 180px;
  display: flex;
  justify-content: space-between;
  margin-right: 80px;
  @media (max-width: 900px) {
    margin-right: 20px;
  }
  @media (max-width: 600px) {
    display: none;
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
    width: 140px;
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
  position: relative;
  min-width: 180px;
  display: flex;
  justify-content: end;
  margin-left: 80px;
  @media (max-width: 900px) {
    margin-left: 20px;
  }
  @media (max-width: 600px) {
    min-width: 110px;
    margin: 0;
  }
`;

const Button = styled.button`
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
  @media (max-width: 600px) {
    display: none;
  }
`;

const Notice = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 20px;
  left: 69px;
  background-color: #c24641;
  border-radius: 50%;
`;
