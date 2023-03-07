import apis from 'apis';
import View from './View';
import { userStore } from 'libs/zustand/store';
import { useNotice } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';

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
    <View
      notice={notice}
      acceptFriend={acceptFriend}
      rejectFriend={rejectFriend}
      acceptInvite={acceptInvite}
      rejectInvite={rejectInvite}
    />
  );
};

export default NoticeModal;
