import { theme } from 'libs/theme/theme';
import styled from 'styled-components';

const FriendModal = () => {
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <div>친구 모달</div>
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
  max-width: 400px;
  // max-height: 400px;
  min-width: 300px;
  min-height: 300px;
  ${theme.common.flexCenterColumn}

  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
`;
