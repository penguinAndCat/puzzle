import { Key, MouseEvent } from 'react';
import styled from 'styled-components';

import apis from 'apis';
import { CloseIcon } from 'components/common/Icon';
import { theme } from 'libs/theme/theme';
import { useModal, userStore } from 'libs/zustand/store';
import { useNotice } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';

const NoticeModal = () => {
  const { removeModal } = useModal();
  const { user } = userStore();
  const toast = useToast();
  const { notice, refetchNotice } = useNotice(user);
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('notice');
  };

  const acceptFriend = async (nickname: string) => {
    if (!user?.id) return;
    const message = await apis.friends.acceptFriend(user.id, nickname);
    if (message === 'success') {
      toast({ nickname: nickname, content: '님과 친구가 되었습니다.', type: 'success' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 친구입니다.', type: 'warning' });
      return;
    }
    refetchNotice();
  };
  const rejectFriend = async (nickname: string) => {
    if (!user?.id) return;
    try {
      await apis.friends.rejectFriend(user.id, nickname);
      toast({ content: '초대를 거절하였습니다.', type: 'success' });
      refetchNotice();
    } catch (err) {
      console.log(err);
    }
  };

  const acceptInvite = async (puzzleId: string) => {
    if (!user?.id) return;
    const message = await apis.puzzles.acceptInvitation(user.id, puzzleId);
    if (message === 'success') {
      toast({ content: '초대를 수락하였습니다.', type: 'success' });
      if (confirm('초대받은 퍼즐로 이동하겠습니까?')) {
        window.location.href = `/puzzle/${puzzleId}`;
      }
    }
    if (message === 'failed') {
      toast({ content: '초대 수락이 실패하였습니다.', type: 'warning' });
      return;
    }
    refetchNotice();
  };
  const rejectInvite = async (puzzleId: string) => {
    if (!user?.id) return;
    try {
      await apis.puzzles.rejectInvitation(user.id, puzzleId);
      toast({ content: '초대를 거절하였습니다.', type: 'success' });
      refetchNotice();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Notice</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <Ul>
        {notice && notice.length > 0 ? (
          notice.map(
            (
              item: { nickname: string; type: 'friend' | 'puzzle'; puzzleId: string },
              index: Key | null | undefined
            ) => {
              if (item.type === 'friend')
                return (
                  <Li key={index}>
                    <NoticeMessage>
                      <Span>{item.nickname}</Span>님께서 당신과 친구를 하고 싶어합니다.
                    </NoticeMessage>
                    <AcceptButton onClick={() => acceptFriend(item.nickname)}>수락</AcceptButton>
                    <RefuseButton onClick={() => rejectFriend(item.nickname)}>거절</RefuseButton>
                  </Li>
                );
              if (item.type === 'puzzle')
                return (
                  <Li key={index}>
                    <NoticeMessage>
                      <Span>{item.nickname}</Span>님께서 당신을 퍼즐 방에 초대합니다.
                    </NoticeMessage>
                    <AcceptButton onClick={() => acceptInvite(item.puzzleId)}>수락</AcceptButton>
                    <RefuseButton onClick={() => rejectInvite(item.puzzleId)}>거절</RefuseButton>
                  </Li>
                );
            }
          )
        ) : (
          <NoneNotice>알림이 없습니다.</NoneNotice>
        )}
      </Ul>
    </Container>
  );
};

export default NoticeModal;

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
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const NoticeMessage = styled.div`
  width: 220px;
`;

const Span = styled.span`
  color: red;
`;

const AcceptButton = styled.button`
  width: 50px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
  margin-right: 6px;
`;

const RefuseButton = styled.button`
  width: 50px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;

const NoneNotice = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;
