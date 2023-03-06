import React from 'react';
import styled from 'styled-components';

import { PopupCloseIcon } from '../Icon';
import { usePopupState, userStore } from 'libs/zustand/store';
import { useNotice } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

interface PopupType {
  /**
   * 요청자 닉네임
   */
  nickname: string;
  /**
   * 요청자 프로필 이미지
   */
  picture: string;
  /**
   * 팝업창 내용
   */
  content: string;
  /**
   * 공지 아이디를 키로 팝업창 삭제 가능
   */
  noticeId: string;
  /**
   * 친구 요청, 퍼즐 초대
   */
  type: 'friend' | 'puzzle';
  /**
   * 퍼즐 초대 수락 시 해당 퍼즐 방으로 이동
   */
  puzzleId?: string;
  /**
   * 팝업창 에니메이션 유무
   */
  animation?: boolean;
}

export default function Popup({ nickname, picture, content, noticeId, type, puzzleId, animation = true }: PopupType) {
  const { removeOnePopup } = usePopupState();
  const { user } = userStore();
  const toast = useToast();
  const { refetchNotice } = useNotice();

  const onclick = async () => {
    if (!user?.id) return;
    removeOnePopup(noticeId);
    if (type === 'friend') {
      const message = await apis.friends.acceptFriend(user.id, nickname);
      if (message === 'success') {
        toast({ nickname: nickname, content: '님과 친구가 되었습니다.', type: 'success' });
      }
      if (message === 'duplicated') {
        toast({ content: '이미 친구입니다.', type: 'warning' });
        return;
      }
    } else if (type === 'puzzle') {
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
    }
    refetchNotice();
  };

  return (
    <Container animation={animation}>
      <Header>
        <IconWrapper onClick={() => removeOnePopup(noticeId)}>
          <PopupCloseIcon />
        </IconWrapper>
      </Header>
      <Main>
        <ImgWrapper>
          <Img src={picture} />
        </ImgWrapper>
        <ContentWrapper>
          <Nickname>{nickname}</Nickname>
          <Content>{content}</Content>
        </ContentWrapper>
      </Main>
      <Footer>
        <Button onClick={onclick}>수락</Button>
      </Footer>
    </Container>
  );
}

const Header = styled.header`
  display: flex;
  position: relative;
  height: 20px;
  // border-bottom: 1px solid ${({ theme }) => theme.bgColor};
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  cursor: pointer;
`;

const Nickname = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Main = styled.main`
  display: flex;
  margin-bottom: 6px;
`;

const Content = styled.div``;

const ImgWrapper = styled.div`
  margin-right: 6px;
`;

const Img = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
`;

const Footer = styled.footer`
  position: relative;
  height: 1.5rem;
`;

const Button = styled.button`
  position: absolute;
  right: 0;
  width: 3rem;
  height: 1.4rem;
  line-height: 1.2rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.bgColor};
  cursor: pointer;
`;

const Container = styled.div<{ animation: boolean }>`
  zindex: 999;
  width: 230px;
  height: 100%;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;

  @keyframes fadeInNoti {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    40% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fadeOutNoti {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    40% {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  animation-fill-mode: forwards;
  ${({ animation }) => animation && 'animation-name: fadeInNoti, fadeOutNoti;'}
  animation-delay: 0s, 59.6s;
  animation-duration: 2s, 1s;

  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border-radius: 4px;
  padding: 6px 8px;
`;
