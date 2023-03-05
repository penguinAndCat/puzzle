import { MouseEvent } from 'react';
import styled from 'styled-components';

import { CloseIcon } from 'components/common/Icon';
import GoogleAuthBtn from 'components/common/AuthButton/GoogleAuthBtn';
import KakaoAuthBtn from 'components/common/AuthButton/KakaoAuthBtn';
import NaverAuthBtn from 'components/common/AuthButton/NaverAuthBtn';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';

const LoginModal = () => {
  const { removeModal } = useModal();
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('login');
  };
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Login</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <ButtonWrapper>
        <GoogleAuthBtn />
        <KakaoAuthBtn />
        <NaverAuthBtn />
      </ButtonWrapper>
    </Container>
  );
};

export default LoginModal;

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
  min-width: 240px;
  min-height: 210px;
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

const ButtonWrapper = styled.div`
  width: 185px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
