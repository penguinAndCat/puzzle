import * as User from 'components/common/User';
import { userStore } from 'libs/zustand/store';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

type SearchedUserProps = {
  picture: string;
  nickname: string;
};

const SearchedUser = (props: { searchedUser: SearchedUserProps }) => {
  const { searchedUser } = props;
  const toast = useToast();
  const { user } = userStore();

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
    <User.Li>
      <User.Img src={searchedUser.picture} />
      <User.Nickname>{searchedUser.nickname}</User.Nickname>
      <User.Button onClick={() => requestFriend(searchedUser.nickname)} data-testid="requestFriend-button">
        친구하기
      </User.Button>
    </User.Li>
  );
};

export default SearchedUser;
