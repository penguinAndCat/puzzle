import { CloseIcon } from 'components/common/Icon';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { MouseEvent } from 'react';
import styled from 'styled-components';
import SearchFriend from './Search';

const searchedUser = [
  { nickname: '닉네임은최대열글자가', picture: '/cp.png' },
  { nickname: '고양이', picture: '/cp2.png' },
  { nickname: '펭귄2', picture: '/cp3.png' },
  { nickname: '고양이2', picture: '/cp4.png' },
  { nickname: '펭귄', picture: '/cp.png' },
  { nickname: '고양이', picture: '/cp2.png' },
  { nickname: '펭귄2', picture: '/cp3.png' },
  { nickname: '고양이2', picture: '/cp4.png' },
];

const FriendModal = () => {
  const { removeModal } = useModal();
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('friend');
  };
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Friend</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <SearchFriend />
      <div>친구 목록</div>
      <Ul>
        {searchedUser.map((item) => {
          return (
            <Li key={item.nickname}>
              <Img src={item.picture} />
              <Nickname>{item.nickname}</Nickname>
              <DeleteButton>삭제</DeleteButton>
            </Li>
          );
        })}
      </Ul>
    </Container>
  );
};

export default FriendModal;

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

const Img = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
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
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nickname = styled.div`
  width: 140px;
  font-size: 12px;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;
