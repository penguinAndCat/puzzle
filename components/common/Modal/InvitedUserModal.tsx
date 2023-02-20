import { CloseIcon } from 'components/common/Icon';
import { useInvitedUser } from 'hooks/apis/useReactQuery';
import { theme } from 'libs/theme/theme';
import { userStore } from 'libs/zustand/store';
import { Key, MouseEvent } from 'react';
import styled from 'styled-components';

const InvitedUserModal = ({ puzzleId, setCloseModal }: { puzzleId: string; setCloseModal: () => void }) => {
  const { user } = userStore();
  const { invitedUser } = useInvitedUser(puzzleId, user);
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    setCloseModal();
  };

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Participants</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <Ul>
        {invitedUser && (
          <div>
            <UserWrapper>
              <Img src={invitedUser.host.picture} alt={invitedUser.host.nickname} />
              <Nickname>{invitedUser.host.nickname}</Nickname>
              <FriendButton>방장</FriendButton>
            </UserWrapper>
            {invitedUser.users.map((participant: any, index: Key | null | undefined) => {
              return (
                <UserWrapper key={index}>
                  <Img src={participant.picture} alt={participant.nickname} />
                  <Nickname>{participant.nickname}</Nickname>
                  {user?.nickname === participant.nickname ? (
                    <FriendButton>나</FriendButton>
                  ) : participant.isFriend > 0 ? (
                    <FriendButton>친구</FriendButton>
                  ) : null}
                </UserWrapper>
              );
            })}
          </div>
        )}
      </Ul>
    </Container>
  );
};

export default InvitedUserModal;

const Container = styled.div`
  @keyframes fadein {
    0% {
      transform: scale(1);
      opacity: 0;
      transform: translate3d(-50%, -100%, 0);
    }
    50% {
      transform: scale(1);
      opacity: 1;
      transform: translate3d(-50%, -45%, 0);
    }
    100% {
      transform: scale(1);
      opacity: 1;
      transform: translate3d(-50%, -50%, 0);
    }
  }
  animation: fadein 0.5s;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  min-width: 250px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 2px ${({ theme }) => theme.modalTextColor};
`;

const Title = styled.div``;

const Close = styled.div`
  width: 30px;
  height: 30px;
  ${theme.common.flexCenter}
`;

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
