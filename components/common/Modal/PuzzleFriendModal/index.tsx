import { CloseIcon } from 'components/common/Icon';
import { usePuzzleFriend } from 'hooks/useReactQuery';
import { useToast } from 'hooks/useToast';
import axios from 'libs/axios';
import { theme } from 'libs/theme/theme';
import { useModal, userStore } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';
import styled from 'styled-components';

const PuzzleFriendModal = () => {
  const router = useRouter();
  const toast = useToast();
  const { removeModal } = useModal();
  const { puzzleFriend } = usePuzzleFriend(router.query.id);
  const { user } = userStore();

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('puzzleFriend');
  };

  const inviteFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const res = await axios.post(`/api/users/puzzle`, {
      data: {
        requester: user.id,
        requestedNickname: requestedNickname,
        puzzleId: router.query.id,
      },
    });
    if (res.data.message === 'success') {
      toast({ content: '초대 요청을 보냈습니다.', type: 'info' });
    }
    if (res.data.message === 'duplicated') {
      toast({ content: '이미 초대 요청을 보냈습니다.', type: 'warning' });
    }
  };

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Invite</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <div>친구 목록</div>
      <Ul>
        {puzzleFriend &&
          puzzleFriend.map((item: { nickname: string; picture: string; isInvited: boolean; isHost: boolean }) => {
            return (
              <Li key={item.nickname}>
                <Img src={item.picture} />
                <Nickname>{item.nickname}</Nickname>
                {item.isHost ? (
                  <InviteDiv>방장</InviteDiv>
                ) : item.isInvited ? (
                  <InviteDiv>초대됨</InviteDiv>
                ) : (
                  <InviteButton onClick={() => inviteFriend(item.nickname)}>초대</InviteButton>
                )}
              </Li>
            );
          })}
      </Ul>
    </Container>
  );
};

export default PuzzleFriendModal;

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
  min-width: 300px;
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
  margin-bottom: 12px;
`;

const Title = styled.div``;

const Close = styled.div`
  width: 30px;
  height: 30px;
  ${theme.common.flexCenter}
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const Ul = styled.ul`
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa; /* 또는 트랙에 추가한다 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
`;

const Li = styled.li`
  width: 300px;
  height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nickname = styled.div`
  width: 140px;
  font-size: 12px;
`;

const InviteDiv = styled.button`
  width: 60px;
  height: 20px;
  font-size: 12px;
  line-height: 16px;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
`;

const InviteButton = styled.button`
  width: 60px;
  height: 20px;
  font-size: 12px;
  line-height: 16px;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;
