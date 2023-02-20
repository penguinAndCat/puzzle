import { Dispatch, Key, SetStateAction, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import apis from 'apis';
import { useSocket } from 'libs/zustand/store';
import { exportLevels } from 'libs/puzzle/createPuzzle';
import { useToast } from 'hooks/views/useToast';
import { useInvitedUser, useRoomInfo } from 'hooks/apis/useReactQuery';

interface Props {
  showRoomInfo: boolean;
  setShowRoomInfo: Dispatch<SetStateAction<boolean>>;
  user: UserInfo | null;
}

const RoomInfo = ({ showRoomInfo, setShowRoomInfo, user }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const { participants } = useSocket();
  const { invitedUser } = useInvitedUser(router.query.id, user);
  const { roomInfo } = useRoomInfo(router.query.id, user);
  const [list, setList] = useState<number[][]>([]);
  const [puzzleNumber, setPuzzleNumber] = useState<number>(0);
  const [display, setDisplay] = useState(false); // fadeout animaition 기다림
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showRoomInfo) {
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
    if (list.length > 0) {
      setPuzzleNumber(list[roomInfo.level][0] * list[roomInfo.level][1]);
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
    const message = await apis.friends.requestFriend(user.id, requestedNickname);
    if (message === 'success') {
      toast({ content: '친구 요청을 보냈습니다.', type: 'success' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 친구 요청을 보냈습니다.', type: 'warning' });
    }
  };

  return (
    <>
      {invitedUser && display && (
        <Container show={showRoomInfo} ref={el}>
          <Title>{roomInfo.title}</Title>
          <Content>
            <SecretRoomWrapper>
              <SecretRoom>{roomInfo.secretRoom ? '비밀 방입니다.' : '공개 방입니다.'}</SecretRoom>
            </SecretRoomWrapper>
            <PuzzleNumberWrapper>
              <div>퍼즐 수</div>
              <div>:</div>
              <div>{puzzleNumber}개</div>
            </PuzzleNumberWrapper>
            <InvitedUserWrapper>
              <MiniTitle>참가자</MiniTitle>
              <div>
                <UserWrapper>
                  <Img src={invitedUser.host.picture} alt={invitedUser.host.nickname} />
                  <Nickname>{invitedUser.host.nickname}</Nickname>
                  {participants.includes(invitedUser.host.nickname) ? <OnParticipant /> : <OffParticipant />}
                  <FriendButton>방장</FriendButton>
                </UserWrapper>
                {invitedUser.users.map((participant: any, index: Key | null | undefined) => {
                  return (
                    <UserWrapper key={index}>
                      <Img src={participant.picture} alt={participant.nickname} />
                      <Nickname>{participant.nickname}</Nickname>
                      {participants.includes(participant.nickname) ? <OnParticipant /> : <OffParticipant />}
                      {user?.nickname === participant.nickname ? (
                        <FriendButton>나</FriendButton>
                      ) : participant.isFriend > 0 ? (
                        <FriendButton>친구</FriendButton>
                      ) : (
                        <FriendRequireButton onClick={() => requestFriend(participant.nickname)}>
                          친구하기
                        </FriendRequireButton>
                      )}
                    </UserWrapper>
                  );
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

const Container = styled.div<{ show: boolean }>`
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
  animation: ${({ show }) => (show ? `fadeinRight` : `fadeoutLeft`)} 0.5s;

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

const SecretRoomWrapper = styled.div``;

const SecretRoom = styled.div``;

const PuzzleNumberWrapper = styled.div`
  display: flex;
  & > div {
    margin: 0 6px 0 0;
  }
`;

const MiniTitle = styled.div`
  margin-bottom: 6px;
`;

const InvitedUserWrapper = styled.div``;

const OnParticipant = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  top: 19px;
  left: 19px;
  background-color: #4aa02c;
  border: 2px solid #3a3b3c;
  border-radius: 50%;
`;

const OffParticipant = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  top: 19px;
  left: 19px;
  background-color: #797979;
  border: 2px solid #3a3b3c;
  border-radius: 50%;
`;

const UserWrapper = styled.div`
  position: relative;
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
