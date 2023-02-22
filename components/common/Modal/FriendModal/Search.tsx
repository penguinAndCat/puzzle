import { useState } from 'react';
import styled, { css } from 'styled-components';

import apis from 'apis';
import SearchedUser from './SearchedUser';

type SearchedUserProps = {
  picture: string;
  nickname: string;
};

const SearchFriend = ({ picture = '', nickname = '' }) => {
  const [searched, setSearched] = useState('');
  const [searchedUser, setSearchedUser] = useState<SearchedUserProps>({
    picture: picture,
    nickname: nickname,
  });

  const searchUser = async () => {
    const user = await apis.users.searchUser(searched);
    setSearchedUser(user);
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
      {searchedUser?.nickname && <SearchedUser searchedUser={searchedUser} />}
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
  border: solid 1px ${({ theme }) => theme.modalTextColor};
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
