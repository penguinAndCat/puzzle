import { Key } from 'react';
import styled from 'styled-components';

import apis from 'apis';
import { userStore } from 'libs/zustand/store';
import { useNotice } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import { Button } from 'components/common/Button';

const NoticeModal = () => {
  const { user } = userStore();
  const toast = useToast();
  const { notice, refetchNotice } = useNotice();

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
    <Ul>
      {notice && notice.length > 0 ? (
        notice.map(
          (item: { nickname: string; type: 'friend' | 'puzzle'; puzzleId: string }, index: Key | null | undefined) => {
            if (item.type === 'friend')
              return (
                <Li key={index}>
                  <NoticeMessage>
                    <Span>{item.nickname}</Span>님께서 당신과 친구를 하고 싶어합니다.
                  </NoticeMessage>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => acceptFriend(item.nickname)}
                    data-testid="acceptFriend-button"
                  >
                    수락
                  </Button>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => rejectFriend(item.nickname)}
                    data-testid="rejectFriend-button"
                  >
                    거절
                  </Button>
                </Li>
              );
            if (item.type === 'puzzle')
              return (
                <Li key={index}>
                  <NoticeMessage>
                    <Span>{item.nickname}</Span>님께서 당신을 퍼즐 방에 초대합니다.
                  </NoticeMessage>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => acceptInvite(item.puzzleId)}
                    data-testid="acceptPuzzle-button"
                  >
                    수락
                  </Button>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => rejectInvite(item.puzzleId)}
                    data-testid="rejectPuzzle-button"
                  >
                    거절
                  </Button>
                </Li>
              );
          }
        )
      ) : (
        <NoneNotice>알림이 없습니다.</NoneNotice>
      )}
    </Ul>
  );
};

export default NoticeModal;

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

const NoneNotice = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;
