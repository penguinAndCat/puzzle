import useTheme from 'hooks/useTheme';
import { theme } from 'libs/theme/theme';
import { useState } from 'react';
import styled from 'styled-components';

const Header = () => {
  const [_, setTheme] = useTheme();
  const [palette, setPalette] = useState(false);
  const onClick = () => {
    if (!palette) {
      setPalette(true);
    } else {
      setPalette(false);
    }
  };
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
          <ColorsWrapper>
            <Colors onClick={onClick}>P</Colors>
            {palette && (
              <Palette>
                <Pink onClick={() => setTheme('pink')}></Pink>
                <Sliver onClick={() => setTheme('silver')}></Sliver>
                <Dark onClick={() => setTheme('dark')}></Dark>
                <Mint onClick={() => setTheme('mint')}></Mint>
              </Palette>
            )}
          </ColorsWrapper>
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
  border-bottom: 3px ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.headerColor};
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
`;

const Bar = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  background-image: linear-gradient(transparent 50%, ${({ theme }) => theme.headerTextColor} 50%);
  background-size: 12px 12px;
`;

const Right = styled.div`
  min-width: 130px;
  ${theme.common.flexCenter};
  margin-left: 80px;
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

const Colors = styled.button`
  border: 1px solid #ffffff;
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.headerTextColor};
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const ColorsWrapper = styled.div`
  position: relative;
  margin-left: 20px;
  height: 30px;
`;

const Palette = styled.div`
  position: absolute;
  ${theme.common.flexCenterColumn}
`;

const paletteButton = `
  border: 1px solid #FFFFFF;
  width: 30px;
  height: 30px;
  margin: 2px 0;
  cursor: pointer;
`;

const Pink = styled.button`
  ${paletteButton};
  background-color: ${theme.colors.pink};
`;

const Mint = styled.button`
  ${paletteButton};
  background-color: ${theme.colors.mint};
`;

const Sliver = styled.button`
  ${paletteButton};
  background-color: ${theme.colors.silver};
`;

const Dark = styled.button`
  ${paletteButton};
  background-color: ${theme.colors.dark};
`;
