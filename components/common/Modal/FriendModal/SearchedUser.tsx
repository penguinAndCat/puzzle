import styled from 'styled-components';

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
    <SearchUserWrapper>
      <Img src={searchedUser.picture} />
      <Nickname>{searchedUser.nickname}</Nickname>
      <RequestButton onClick={() => requestFriend(searchedUser.nickname)} data-testid="requestFriend-button">
        친구하기
      </RequestButton>
    </SearchUserWrapper>
  );
};

export default SearchedUser;

const SearchUserWrapper = styled.div`
  width: 300px;
  height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const Nickname = styled.div`
  width: 120px;
  font-size: 12px;
`;

const RequestButton = styled.button`
  width: 68px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;
