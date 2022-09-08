import styled from 'styled-components';

const Header = () => {
  return (
    <Container>
      <Wrapper>
        <Left>
          <div>메뉴</div>
          <div>검색</div>
        </Left>
        <Logo>
          <div>C & P</div>
          <div>puzzle</div>
        </Logo>
        <Right>
          <div>로그인</div>
          <div>로그아웃</div>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  background-color: pink;
`;

const Left = styled.div`
  display: flex;
`;

const Logo = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Right = styled.div`
  display: flex;
`;
