import { CloseIcon } from 'components/common/Icon';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { MouseEvent } from 'react';
import styled from 'styled-components';

const alarm = [
  { requester: '닉네임은최대열글자가', requested: '펭귄' },
  { requester: '펭펭', requested: '펭귄' },
  { requester: 'lovely_cat', requested: '펭귄' },
  { requester: '몇글자까지되나궁금해', requested: '펭귄' },
];

const AlarmModal = () => {
  const { removeModal } = useModal();
  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('friend');
  };
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Alarm</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <Ul>
        {alarm.map((item, index) => {
          return (
            <Li key={index}>
              <AlarmMessage>
                <Span>{item.requester}</Span>님께서 당신과 친구를 하고 싶어합니다.
              </AlarmMessage>
              <AcceptButton>수락</AcceptButton>
            </Li>
          );
        })}
      </Ul>
    </Container>
  );
};

export default AlarmModal;

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
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const AlarmMessage = styled.div`
  width: 220px;
`;

const Span = styled.span`
  color: red;
`;

const AcceptButton = styled.button`
  width: 40px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;
