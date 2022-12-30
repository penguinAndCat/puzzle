import { useToast } from 'hooks/useToast';
import { theme } from 'libs/theme/theme';
import styled from 'styled-components';

const Toast = () => {
  const { toast } = useToast();
  return (
    <Wrapper>
      {toast.content !== '' && (
        <Content toast={toast}>
          <Nickname>{toast.nickname}</Nickname>
          {toast.content}
        </Content>
      )}
    </Wrapper>
  );
};

export default Toast;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 999;
`;

const Nickname = styled.span`
  color: red;
`;

const Content = styled.div<any>`
  @keyframes fadeIn {
    0% {
      opacity: 1;
      transform: translate(-50%, -200%);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -40%);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -200%);
    }
  }
  animation-fill-mode: forwards;
  animation-name: fadeIn, fadeOut;
  animation-delay: 0s, 2s;
  animation-duration: 0.7s, 0.7s;

  position: fixed;
  top: ${({ toast }) => toast.top}px;
  left: ${({ toast }) => (toast.left === undefined ? '50%' : toast.left)};
  transform: translate(-50%, 0);

  ${theme.common.flexCenter}
  width: 240px;
  height: 30px;
  z-index: 999;
  color: ${({ theme }) => theme.bgColor};
  background-color: ${({ theme }) => theme.textColor};
  border: 2px solid ${({ theme }) => theme.bgColor};
  border-radius: 4px;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
`;
