import styled from 'styled-components';

const Header = () => {
  return (
    <Wrapper>
      <div></div>
      <div>hello</div>
      <div></div>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  font-size: 45px;
`;
