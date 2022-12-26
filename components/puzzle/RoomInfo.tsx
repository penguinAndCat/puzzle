import { Dispatch, Key, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { exportLevels } from '../../libs/puzzle/createPuzzle';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useInvitedUser } from 'hooks/useInvitedUser';
import { useToast } from 'hooks/useToast';

interface Props {
  showRoomInfo: boolean;
  setShowRoomInfo: Dispatch<SetStateAction<boolean>>;
  user: UserInfo | null;
}

const RoomInfo = ({ showRoomInfo, setShowRoomInfo, user }: Props) => {
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState({title: '', secretRoom: false, level: 1});
  const [list, setList] = useState<number[][]>([]);
  const [display, setDisplay] = useState(false); // fadeout animaition 기다림
  const el = useRef<HTMLDivElement>(null);
  const { fireToast } = useToast();
  const { data, refetch } = useInvitedUser(router.query.id);

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
    if (router.query.id === undefined) return;
    const getData = async () => {
      const res = await axios.get(`/api/puzzle/info/${router.query.id}`);
      setRoomInfo(res.data.item);
    }
    getData();
    refetch();
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if(list.length > 0){
      setRoomInfo({...roomInfo, level: list[roomInfo.level][0] * list[roomInfo.level][1]});
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

  const requestFriend = async (requestedNickname: string) => {
    if (user === null) return;
    const res = await axios.post(`/api/users/freinds`, {
      data: {
        requester: user.id,
        requestedNickname: requestedNickname,
      },
    });
    if (res.data.message === 'duplicated') {
      fireToast({ content: '이미 친구 요청을 보냈습니다.', top: 100 });
    }
  };

  return (
    <>
      {data && display && (
        <Container show={showRoomInfo} ref={el}>
          <Title>{roomInfo.title}</Title>
          <Content>
            <SecretRoomWrapper>
              <SecretRoom>{roomInfo.secretRoom ? '비밀 방입니다.' : '공개 방입니다.'}</SecretRoom>
            </SecretRoomWrapper>
            <PuzzleNumberWrapper>
              <div>퍼즐 수</div>
              <div>:</div>
              <div>{roomInfo.level}개</div>
            </PuzzleNumberWrapper>
            <InvitedUserWrapper>
              <MiniTitle>참가자</MiniTitle>
              <div>
                {data.map((user: any, index: Key | null | undefined) => {
                  return (
                    <UserWrapper key={index}>
                      <Img src={user.picture} />
                      <Nickname>{user.nickname}</Nickname>
                      {
                        user.isFriend > 0 ? 
                        <FriendButton>친구</FriendButton> :
                        <FriendRequireButton onClick={() => requestFriend(user.nickname)}>친구하기</FriendRequireButton>
                      }
                    </UserWrapper>
                  )
                })}
              </div>
            </InvitedUserWrapper>
          </Content>
        </Container>
      )}
    </>
  );
};

export default RoomInfo;

const Container = styled.div<{show: boolean}>`
  @keyframes fadeinRight {
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
  @keyframes fadeoutLeft {
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
  animation: ${({ show }) => show ? `fadeinRight` : `fadeoutLeft` } 0.5s;

  position: absolute;
  width: 260px;
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
  border-bottom: 2px ${({ theme }) => theme.borderColor};
`;


const Content = styled.div`
  margin-top: 24px;
  padding: 0 18px;
  color: ${({ theme }) => theme.headerTextColor};
  font-weight: 500;
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

const MiniTitle = styled.div`
  margin-bottom: 6px;
`;

const InvitedUserWrapper = styled.div`

`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 8px;
`;

const Nickname = styled.div`
  width: 100px;
  margin-right: 8px;
  font-size: 12px;
`;

const FriendButton = styled.div`
  width: 80px;
  height: 20px;
  font-size: 12px;
  border: 1px ${({ theme }) => theme.borderColor};
  text-align: center;
  line-height: 20px;
  border-radius: 2px;
`;

const FriendRequireButton = styled.div`
  width: 80px;
  height: 20px;
  font-size: 12px;
  border: 1px ${({ theme }) => theme.borderColor};
  text-align: center;
  line-height: 20px;
  border-radius: 2px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.headerTextColor};
  color: ${({ theme }) => theme.headerColor};
`;