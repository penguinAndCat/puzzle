import * as User from 'components/common/User';
import { useModal, userStore } from 'libs/zustand/store';
import { useInvitedUser } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';
import View from './View';

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
  return <View invitedUser={invitedUser} requestFriend={requestFriend} />;
};

export default InvitedUserModal;
