import styled from 'styled-components';

import GoogleAuthBtn from 'components/common/AuthButton/GoogleAuthBtn';
import KakaoAuthBtn from 'components/common/AuthButton/KakaoAuthBtn';
import NaverAuthBtn from 'components/common/AuthButton/NaverAuthBtn';

const LoginModal = () => {
  return (
    <ButtonWrapper>
      <GoogleAuthBtn />
      <KakaoAuthBtn />
      <NaverAuthBtn />
    </ButtonWrapper>
  );
};

export default LoginModal;

const ButtonWrapper = styled.div`
  width: 185px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
