import styled from 'styled-components';

const Header = () => {
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
          <Button>로그인</Button>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 110px;
  display: flex;
  justify-content: center;
  padding: 20px 60px;
  border-bottom: 3px solid pink;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  width: 200px;
  display: flex;
  margin-right: 80px;
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
  color: pink;
`;

const Bar = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  background-image: linear-gradient(transparent 50%, pink 50%);
  background-size: 12px 12px;
`;

const Right = styled.div`
  width: 200px;
  margin-left: 80px;
`;

const Button = styled.button`
  width: 80px;
  border: 3px solid pink;
  border-radius: 4px;
  color: pink;
  font-weight: 600;
  text-align: center;
  background-color: #fff;
`;
