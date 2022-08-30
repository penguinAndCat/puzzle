import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PuzzleCanvas from '../components/canvasPuzzle';
import Header from '../components/common/header';
import { exportConfig } from '../libs/puzzle/createPuzzle';

const Home: NextPage = () => {
  const [puzzleLevel, setPuzzleLevel] = useState(2);
  const [puzzleImg, setPuzzleImg] = useState<img>({ src: '/test2.jpg', width: 1000, height: 1000 });
  const [showLevel, setShowLevel] = useState(false);
  const [display, setDisplay] = useState(false);
  const [list, setList] = useState<number[][]>([]);

  useEffect(() => {
    if (showLevel) {
      const config = exportConfig();
      setList(config.levels);
    }
  }, [showLevel]);

  useEffect(() => {
    if (display) {
      setShowLevel(true);
    }
  }, [display]);

  return (
    <Container onClick={() => setShowLevel(false)}>
      <Header
        puzzleImg={puzzleImg}
        setPuzzleImg={setPuzzleImg}
        setShowLevel={setShowLevel}
        showLevel={showLevel}
        setShowLvMenu={setDisplay}
      />
      {display && (
        <Levels
          show={showLevel}
          onTransitionEnd={() => {
            if (!showLevel) {
              setDisplay(false);
            }
          }}
        >
          <h1>레벨 목록</h1>
          <List>
            {list.map(([row, col], index) => {
              return (
                <Item
                  selected={index === puzzleLevel}
                  key={index}
                  onClick={() => {
                    setPuzzleLevel(() => index);
                    setShowLevel(false);
                  }}
                >
                  {row * col}
                </Item>
              );
            })}
          </List>
        </Levels>
      )}
      <PuzzleCanvas puzzleLv={puzzleLevel} puzzleImg={puzzleImg} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;

const Levels = styled.div<{ show: boolean }>`
  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;
  left: 0;
  color: black;
  background-color: white;
  box-shadow: 0 0 20px 1px gray;
  transform: translateX(-100%);
  transform: translateX(${({ show }) => (show ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  h1 {
    text-align: center;
  }
`;

const List = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

const Item = styled.li<{ selected: boolean }>`
  box-sizing: border-box;
  font-size: 1.5rem;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 5px solid ${({ selected }) => (selected ? 'black' : 'rgba(0, 0, 0, 0.1)')};
  background-color: ${({ selected }) => (selected ? 'rgba(0, 0, 0, 0.1)' : 'white')};
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Input = styled.input`
  display: none;
`;
