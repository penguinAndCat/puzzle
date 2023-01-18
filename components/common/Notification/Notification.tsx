import React from 'react';
import styled from 'styled-components';
import { CloseIcon } from '../Icon';

const TYPE = {
  success: {
    color: '#0ED73F',
  },
  warning: {
    color: '#E3E60E',
  },
  info: {
    color: '#0E42E6',
  },
};

export default function Notification({ option }: { option: NotificationType }) {
  return (
    <Container>
      <Header>
        <IconWrapper>
          <CloseIcon />
        </IconWrapper>
      </Header>
      <Main>
        <ImgWrapper>
          <Img src={option.picture} />
        </ImgWrapper>
        <ContentWrapper>
          <Nickname>{option.nickname}</Nickname>
          <Content>{option.content}</Content>
        </ContentWrapper>
      </Main>
      <Footer>
        <Button>수락</Button>
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
  line-height: 1.4rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border: 1px solid ${({ theme }) => theme.bgColor};
  cursor: pointer;
`;

const Container = styled.div`
  zindex: 999;
  width: 230px;
  height: 100%;
  align-items: center;
  margin-bottom: 10px;
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
  animation-name: fadeInNoti, fadeOutNoti;
  animation-delay: 0s, 29000.6s;
  animation-duration: 2s, 1s;

  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border-radius: 4px;
  padding: 6px 8px;
`;
