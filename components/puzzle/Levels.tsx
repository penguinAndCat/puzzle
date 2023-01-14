import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { exportLevels } from '../../libs/puzzle/createPuzzle';
import { usePuzzle } from 'libs/zustand/store';

interface Props {
  showLevel: boolean;
  setShowLevel: Dispatch<SetStateAction<boolean>>;
}

const Levels = ({ showLevel, setShowLevel }: Props) => {
  const { number, setNumber, setFirstRender } = usePuzzle();
  const [list, setList] = useState<number[][]>([]);
  const [display, setDisplay] = useState(false); // fadeout animaition 기다림
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showLevel) {
      const levels = exportLevels();
      setList(levels);
      setDisplay(true);
    } else {
      setTimeout(() => {
        setDisplay(false);
      }, 450);
    }
  }, [showLevel]);

  useEffect(() => {
    const handleCloseLevels = (e: CustomEvent<MouseEvent>) => {
      if (!el.current || !el.current.contains(e.target as Element)) {
        setShowLevel(false);
      }
    };
    window.addEventListener('mousedown', handleCloseLevels as EventListener);
    return () => {
      window.removeEventListener('mousedown', handleCloseLevels as EventListener);
    };
  }, []);

  return (
    <>
      {display && (
        <Container show={showLevel} ref={el}>
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
                      setFirstRender(true);
                    }}
                  >
                    {row * col}
                  </Item>
                );
              })}
            </List>
          </OverflowBox>
        </Container>
      )}
    </>
  );
};

export default Levels;

const Container = styled.div<{ show: boolean }>`
  @keyframes fadein {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(5%);
    }
    100% {
      transform: translateX(0%);
    }
  }
  @keyframes fadeout {
    0% {
      transform: translateX(0%);
    }
    50% {
      transform: translateX(5%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  animation: ${({ show }) => (show ? `fadein` : `fadeout`)} 0.5s;

  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;
  left: 0;
  color: black;
  box-shadow: 0 0 20px 1px gray;
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
