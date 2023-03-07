import { useRouter } from 'next/router';

import View from './View';
import { userStore } from 'libs/zustand/store';
import { usePuzzleFriend } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const PuzzleFriendModal = () => {
  const router = useRouter();
  const toast = useToast();
  const { puzzleFriend } = usePuzzleFriend(router.query.id);
  const { user } = userStore();

  const inviteFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const message = await apis.puzzles.requestInvitation(user.id, requestedNickname, router.query.id);
    if (message === 'success') {
      toast({ content: '초대 요청을 보냈습니다.', type: 'info' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 초대 요청을 보냈습니다.', type: 'warning' });
    }
  };

  return <View puzzleFriend={puzzleFriend} inviteFriend={inviteFriend} />;
};

export default PuzzleFriendModal;
