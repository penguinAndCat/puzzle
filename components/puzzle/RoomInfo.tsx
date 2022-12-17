import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { exportLevels } from '../../libs/puzzle/createPuzzle';
import { usePuzzle } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Props {
  showRoomInfo: boolean;
  setShowRoomInfo: Dispatch<SetStateAction<boolean>>;
}

const RoomInfo = ({ showRoomInfo, setShowRoomInfo }: Props) => {
  const router = useRouter();
  const [data, setData] = useState({title: '', secretRoom: false, level: 1});
  const [list, setList] = useState<number[][]>([]);
  const [display, setDisplay] = useState(false); // fadeout animaition 기다림
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(showRoomInfo){
      const levels = exportLevels();
      setList(levels);
      setDisplay(true);
    } else {
      setTimeout(() => {
        setDisplay(false);
      }, 450); 
    }
  }, [showRoomInfo]);

  useEffect(() => {
    if (!router.isReady) return;
    const getData = async () => {
      const res = await axios.get(`/api/puzzle/info/${router.query.id}`);
      setData(res.data.item);
    }
    getData();
  }, [router.query.id]);

  useEffect(() => {
    if(list.length > 0){
      setData({...data, level: list[data.level][0] * list[data.level][1]});
    }
  }, [list]);

  useEffect(() => {
    const handleCloseRoomInfo = (e: CustomEvent<MouseEvent>) => {
      if (!el.current || !el.current.contains(e.target as Element)) {
        setShowRoomInfo(false);
      }
    };
    window.addEventListener('mousedown', handleCloseRoomInfo as EventListener);
    return () => {
      window.removeEventListener('mousedown', handleCloseRoomInfo as EventListener);
    };
  }, []);

  return (
    <>
      {display && (
        <Container show={showRoomInfo} ref={el}>
          <Title>{data.title} 방 정보</Title>
          <Content>
            <SecretRoomWrapper>
              <SecretRoom>{data.secretRoom ? '비밀 방입니다.' : '공개 방입니다.'}</SecretRoom>
            </SecretRoomWrapper>
            <PuzzleNumberWrapper>
              <div>퍼즐 수</div>
              <div>:</div>
              <div>{data.level}개</div>
            </PuzzleNumberWrapper>
            <div>
              <div>참가자</div>
              <div>
                {/* <div>{data}</div> */}
              </div>
            </div>
          </Content>
        </Container>
      )}
    </>
  );
};

export default RoomInfo;

const Container = styled.div<{show: boolean}>`
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
  animation: ${({ show }) => show ? `fadein` : `fadeout` } 0.5s;

  position: absolute;
  width: 240px;
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


const Content = styled.div`
  margin-top: 24px;
  padding: 0 24px;
  color: ${({ theme }) => theme.headerTextColor};
  & > div {
    margin-bottom: 6px;
  }
`;

const SecretRoomWrapper = styled.div`
  
`;

const SecretRoom = styled.div`
  
`;

const PuzzleNumberWrapper = styled.div`
  display: flex;
  & > div {
    margin: 0 6px 0 0;
  }
`;