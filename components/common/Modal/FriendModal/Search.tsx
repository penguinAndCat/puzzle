import axios from 'axios';
import Portal from 'components/common/Portal';
import { useToast } from 'hooks/useToast';
import { userStore } from 'libs/zustand/store';
import { useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const SearchFriend = () => {
  const [searched, setSearched] = useState('');
  const [searchedUser, setSearchedUser] = useState<any>([]);
  const { fireToast } = useToast();
  const { user } = userStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchUser = async () => {
    const res = await axios.get(`/api/users/${searched}`);
    setSearchedUser(res.data.user);
  };
  const requestFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const res = await axios.post(`/api/users/request`, {
      data: {
        requester: user.id,
        requestedNickname: requestedNickname,
      },
    });
    if (res.data.message === 'duplicated') {
      const top = buttonRef.current?.getBoundingClientRect().top;
      fireToast({ content: '이미 친구 요청을 보냈습니다.', top: top });
    }
  };
  return (
    <Container>
      <InputWrapper>
        <div>새로운 친구 찾기</div>
        <div>
          <Input onChange={(e) => setSearched(e.target.value)} value={searched} placeholder="닉네임을 입력해주세요." />
          <SearchButton onClick={searchUser}>찾기</SearchButton>
        </div>
      </InputWrapper>
      {searchedUser.length === 1 && (
        <SearchUserWrapper>
          <Img src={searchedUser[0].picture} />
          <Nickname>{searchedUser[0].nickname}</Nickname>
          <RequestButton onClick={() => requestFriend(searchedUser[0].nickname)} ref={buttonRef}>
            친구 하기
          </RequestButton>
        </SearchUserWrapper>
      )}
      <Portal selector="div">
        <div></div>
      </Portal>
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
  width: 50px;
  height: 50px;
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
