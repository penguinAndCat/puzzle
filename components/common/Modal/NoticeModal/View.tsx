import { Key } from 'react';
import styled from 'styled-components';
import { Button } from 'components/common/Button';

const View = ({
  notice,
  acceptFriend,
  acceptInvite,
  rejectFriend,
  rejectInvite,
}: {
  notice?: any[];
  acceptFriend: (arg0: string) => void;
  acceptInvite: (arg0: string) => void;
  rejectFriend: (arg0: string) => void;
  rejectInvite: (arg0: string) => void;
}) => {
  return (
    <Ul>
      {notice && notice.length > 0 ? (
        notice.map(
          (item: { nickname: string; type: 'friend' | 'puzzle'; puzzleId: string }, index: Key | null | undefined) => {
            if (item.type === 'friend')
              return (
                <Li key={index}>
                  <NoticeMessage>
                    <Span>{item.nickname}</Span>님께서 당신과 친구를 하고 싶어합니다.
                  </NoticeMessage>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => acceptFriend(item.nickname)}
                    data-testid="acceptFriend-button"
                    css={{ margin: ' 0 4px' }}
                  >
                    수락
                  </Button>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => rejectFriend(item.nickname)}
                    data-testid="rejectFriend-button"
                  >
                    거절
                  </Button>
                </Li>
              );
            if (item.type === 'puzzle')
              return (
                <Li key={index}>
                  <NoticeMessage>
                    <Span>{item.nickname}</Span>님께서 당신을 퍼즐 방에 초대합니다.
                  </NoticeMessage>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => acceptInvite(item.puzzleId)}
                    data-testid="acceptPuzzle-button"
                    css={{ margin: ' 0 4px' }}
                  >
                    수락
                  </Button>
                  <Button
                    buttonType="modalNotice"
                    onClick={() => rejectInvite(item.puzzleId)}
                    data-testid="rejectPuzzle-button"
                  >
                    거절
                  </Button>
                </Li>
              );
          }
        )
      ) : (
        <NoneNotice>알림이 없습니다.</NoneNotice>
      )}
    </Ul>
  );
};

export default View;

const Ul = styled.ul`
  height: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #cccccc;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
`;

const Li = styled.li`
  width: 300px;
  height: 50px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const NoticeMessage = styled.div`
  width: 220px;
`;

const Span = styled.span`
  color: red;
`;

const NoneNotice = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;
