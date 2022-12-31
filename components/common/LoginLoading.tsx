import styled from 'styled-components';

const LoginLoading = () => {
  return (
    <Wrapper>
      <Infinity>
        <div>
          <span></span>
        </div>
        <div>
          <span></span>
        </div>
        <div>
          <span></span>
        </div>
      </Infinity>
      <LoadingTitle>
        <div>로그인 중 입니다.</div>
        <div>잠시만 기다려주세요.</div>
      </LoadingTitle>
    </Wrapper>
  );
};

export default LoginLoading;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bgColor};
  pointer-events: none;
`;

const Infinity = styled.div`
  width: 120px;
  height: 60px;
  position: relative;
  div,
  span {
    position: absolute;
  }
  div {
    top: 0;
    left: 50%;
    width: 60px;
    height: 60px;
    animation: rotate 6.9s linear infinite;
    span {
      left: -8px;
      top: 50%;
      margin: -8px 0 0 0;
      width: 16px;
      height: 16px;
      display: block;
      background-color: ${({ theme }) => theme.loadingColor1};
      box-shadow: 2px 2px 8px ${({ theme }) => theme.loadingColor1}09;
      border-radius: 50%;
      transform: rotate(90deg);
      animation: move 6.9s linear infinite;
      &:before,
      &:after {
        content: '';
        position: absolute;
        display: block;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        background: inherit;
        top: 50%;
        left: 50%;
        margin: -7px 0 0 -7px;
        box-shadow: inherit;
      }
      &:before {
        animation: drop1 0.8s linear infinite;
      }
      &:after {
        animation: drop2 0.8s linear infinite 0.4s;
      }
    }
    &:nth-child(2) {
      animation-delay: -2.3s;
      span {
        animation-delay: -2.3s;
      }
    }
    &:nth-child(3) {
      animation-delay: -4.6s;
      span {
        animation-delay: -4.6s;
      }
    }
  }

  @keyframes moveSvg {
    0% {
      offset-distance: 0%;
    }
    25% {
      background: ${({ theme }) => theme.loadingColor2};
    }
    75% {
      background: ${({ theme }) => theme.loadingColor3};
    }
    100% {
      offset-distance: 100%;
    }
  }
  @keyframes move {
    0%,
    50% {
      left: -8px;
    }
    25% {
      background: ${({ theme }) => theme.loadingColor2};
    }
    75% {
      background: ${({ theme }) => theme.loadingColor3};
    }
    50.0001%,
    100% {
      left: auto;
      right: -8px;
    }
  }
  @keyframes rotate {
    50% {
      transform: rotate(360deg);
      margin-left: 0;
    }
    50.0001%,
    100% {
      margin-left: -60px;
    }
  }
  @keyframes drop1 {
    100% {
      transform: translate(32px, 8px) scale(0);
    }
  }
  @keyframes drop2 {
    0% {
      transform: translate(0, 0) scale(0.9);
    }
    100% {
      transform: translate(32px, -8px) scale(0);
    }
  }
`;

const LoadingTitle = styled.div`
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    margin: 8px 0 0;
  }
`;
