import { useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { userStore } from 'libs/zustand/store';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const SearchFriend = () => {
  const [searched, setSearched] = useState('');
  const [searchedUser, setSearchedUser] = useState<any>({});
  const toast = useToast();
  const { user } = userStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const searchUser = async () => {
    const user = await apis.users.searchUser(searched);
    setSearchedUser(user);
  };

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
    <Container>
      <InputWrapper>
        <div>새로운 친구 찾기</div>
        <div>
          <Input
            onChange={(e) => setSearched(e.target.value)}
            value={searched}
            placeholder="닉네임을 입력해주세요."
            data-testid="friend-input"
          />
          <SearchButton onClick={searchUser} data-testid="searchFriend-button">
            찾기
          </SearchButton>
        </div>
      </InputWrapper>
      {searchedUser?.nickname && (
        <SearchUserWrapper>
          <Img src={searchedUser.picture} />
          <Nickname>{searchedUser.nickname}</Nickname>
          <RequestButton
            onClick={() => requestFriend(searchedUser.nickname)}
            ref={buttonRef}
            data-testid="requestFriend-button"
          >
            친구하기
          </RequestButton>
        </SearchUserWrapper>
      )}
    </Container>
  );
};

export default SearchFriend;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const ModalTheme = css`
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 2px ${({ theme }) => theme.modalTextColor};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div:first-child {
    margin: 8px 0;
  }
  & > div:last-child {
    margin: 0 0 8px 0;
    display: flex;
  }
`;

const Input = styled.input`
  width: 160px;
  height: 24px;
  ${ModalTheme}
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.modalTextColor};
  }
  margin-right: 8px;
`;

const SearchButton = styled.button`
  ${ModalTheme}
  width: 60px;
  height: 24px;
  cursor: pointer;
`;

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
