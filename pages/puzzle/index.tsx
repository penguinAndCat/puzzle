import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PuzzleCanvas from '../../components/PuzzleCanvas';
import Header from '../../components/puzzle/Header';
import { exportLevels } from '../../libs/puzzle/createPuzzle';
import { useModal } from 'libs/zustand/store';

const Home: NextPage = () => {
  const { modalImage, number, setNumber } = useModal();
  const [showLevel, setShowLevel] = useState(false);
  const [display, setDisplay] = useState(false);
  const [list, setList] = useState<number[][]>([]);

  useEffect(() => {
    if (showLevel) {
      const levels = exportLevels();
      setList(levels);
    }
  }, [showLevel]);

  useEffect(() => {
    if (display) {
      setShowLevel(true);
    }
  }, [display]);

  return (
    <Container onClick={() => setShowLevel(false)}>
      <Header puzzleImg={modalImage} setShowLevel={setShowLevel} showLevel={showLevel} setShowLvMenu={setDisplay} />
      {display && (
        <Levels
          show={showLevel}
          onTransitionEnd={() => {
            if (!showLevel) {
              setDisplay(false);
            }
          }}
        >
          <Title>레벨 목록</Title>
          <OverflowBox>
            <List>
              {list.map(([row, col], index) => {
                return (
                  <Item
                    selected={index === number}
                    key={index}
                    onClick={() => {
                      setNumber(index);
                      setShowLevel(false);
                    }}
                  >
                    {row * col}
                  </Item>
                );
              })}
            </List>
          </OverflowBox>
        </Levels>
      )}
      <PuzzleCanvas puzzleLv={number} puzzleImg={modalImage} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Levels = styled.div<{ show: boolean }>`
  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;
  left: 0;
  color: black;
  box-shadow: 0 0 20px 1px gray;
  transform: translateX(-100%);
  transform: translateX(${({ show }) => (show ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  background-color: ${({ theme }) => theme.headerColor};
`;

const Title = styled.h1`
  width: 100%;
  height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.headerTextColor};
  font-size: 18px;
  font-weight: 600;
  line-height: 40px;
`;

const OverflowBox = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 100px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const List = styled.ul`
  width: 100%;
  display: block;
  min-height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li<{ selected: boolean }>`
  display: inline-block;
  box-sizing: border-box;
  font-size: 1.5rem;
  width: 100px;
  padding: 10px;
  cursor: pointer;
  // border-bottom: 5px solid ${({ selected }) => (selected ? ({ theme }) => theme.headerTextColor : '#FFF')};
  background-color: ${({ selected }) =>
    selected ? ({ theme }) => theme.headerTextColor : ({ theme }) => theme.headerColor};
  color: ${({ selected }) => (selected ? ({ theme }) => theme.headerColor : ({ theme }) => theme.headerTextColor)};
  text-align: center;
  &:hover {
    background-color: ${({ theme }) => theme.headerTextColor};
    color: ${({ theme }) => theme.headerColor};
  }
`;

const Input = styled.input`
  display: none;
`;
