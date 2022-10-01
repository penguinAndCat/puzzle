import useTheme from 'hooks/useTheme';
import { theme } from 'libs/theme/theme';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Palette = () => {
  const [_, setTheme] = useTheme();
  const [palette, setPalette] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const onClick = () => {
    if (!palette) {
      setPalette(true);
    } else {
      setPalette(false);
    }
  };

  useEffect(() => {
    const handleClosePalette = (e: CustomEvent<MouseEvent>) => {
      if (!el.current || !el.current.contains(e.target as Element)) {
        setPalette(false);
      }
    };
    window.addEventListener('click', handleClosePalette as EventListener);
    return () => {
      window.removeEventListener('click', handleClosePalette as EventListener);
    };
  }, []);

  return (
    <ColorsWrapper ref={el}>
      <Colors onClick={onClick}>P</Colors>
      {palette && (
        <PaletteWrapper>
          <Pink onClick={() => setTheme('pink')}></Pink>
          <Sliver onClick={() => setTheme('silver')}></Sliver>
          <Dark onClick={() => setTheme('dark')}></Dark>
          <Mint onClick={() => setTheme('mint')}></Mint>
        </PaletteWrapper>
      )}
    </ColorsWrapper>
  );
};

export default Palette;

const Colors = styled.button`
  border: 1px solid #ffffff;
  ${theme.common.flexCenter}
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.bgColor};
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
  @media (max-width: 600px) {
    margin-left: 5px;
  }
`;

const PaletteWrapper = styled.div`
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
