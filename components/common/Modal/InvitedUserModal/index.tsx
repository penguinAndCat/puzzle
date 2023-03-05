import styled from 'styled-components';

import { useModal, userStore } from 'libs/zustand/store';
import { useInvitedUser } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const InvitedUserModal = () => {
  const { user } = userStore();
  const { puzzleId } = useModal();
  const { invitedUser } = useInvitedUser(puzzleId, user);
  const toast = useToast();

  const requestFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const message = await apis.friends.requestFriend(user.id, requestedNickname);
    if (message === 'success') {
      toast({ content: '친구 요청을 보냈습니다.', type: 'success' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 친구 요청을 보냈습니다.', type: 'warning' });
    }
  };

  return (
    <Ul>
      {invitedUser && (
        <div>
          <UserWrapper>
            <Img src={invitedUser.host.picture} alt={invitedUser.host.nickname} />
            <Nickname>{invitedUser.host.nickname}</Nickname>
            <FriendButton>방장</FriendButton>
          </UserWrapper>
          {invitedUser.users.map(
            (participant: { picture: string; nickname: string; isFriend: number }, index: number) => {
              return (
                <UserWrapper key={index}>
                  <Img src={participant.picture} alt={participant.nickname} />
                  <Nickname>{participant.nickname}</Nickname>
                  {user?.nickname === participant.nickname ? (
                    <FriendButton>나</FriendButton>
                  ) : participant.isFriend > 0 ? (
                    <FriendButton>친구</FriendButton>
                  ) : (
                    <FriendButton style={{ cursor: 'pointer' }} onClick={() => requestFriend(participant.nickname)}>
                      친구하기
                    </FriendButton>
                  )}
                </UserWrapper>
              );
            }
          )}
        </div>
      )}
    </Ul>
  );
};

export default InvitedUserModal;

const Ul = styled.ul`
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 8px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa; /* 또는 트랙에 추가한다 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
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
