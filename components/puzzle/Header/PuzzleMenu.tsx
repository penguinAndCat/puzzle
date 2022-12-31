import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

type Props = {
  user: UserInfo | null;
  roomInfo: { title: string; secretRoom: boolean; level: number };
  setShowLevel: Dispatch<SetStateAction<boolean>>;
  setShowRoomInfo: Dispatch<SetStateAction<boolean>>;
  createPuzzleRoom: () => void;
};

const PuzzleMenu = ({ user, roomInfo, setShowLevel, setShowRoomInfo, createPuzzleRoom }: Props) => {
  const { addModal } = useModal();
  const router = useRouter();
  const [dropDown, setDropDown] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const onClick = () => {
    if (!dropDown) {
      setDropDown(true);
    } else {
      setDropDown(false);
    }
  };

  useEffect(() => {
    const handleCloseDropDown = (e: CustomEvent<MouseEvent>) => {
      if (!el.current || !el.current.contains(e.target as Element)) {
        setDropDown(false);
      }
    };
    window.addEventListener('click', handleCloseDropDown as EventListener);
    return () => {
      window.removeEventListener('click', handleCloseDropDown as EventListener);
    };
  }, []);

  return (
    <ButtonWrapper ref={el}>
      <Button onClick={onClick}>메뉴</Button>
      {dropDown && (
        <DropDownWrapper>
          {router.query.id === undefined ? (
            <DropDownButton onClick={() => setShowLevel(true)}>퍼즐수</DropDownButton>
          ) : (
            <DropDownButton onClick={() => setShowRoomInfo(true)}>방 정보</DropDownButton>
          )}
          {router.query.id === undefined ? (
            <DropDownButton onClick={createPuzzleRoom}>방 만들기</DropDownButton>
          ) : (
            roomInfo &&
            roomInfo.secretRoom && <DropDownButton onClick={() => addModal('puzzleFriend')}>초대하기</DropDownButton>
          )}
        </DropDownWrapper>
      )}
    </ButtonWrapper>
  );
};

export default PuzzleMenu;

const ButtonWrapper = styled.div`
  position: relative;
  margin-left: 20px;
  height: 30px;
  display: none;
  @media (max-width: 600px) {
    margin-left: 5px;
    display: flex;
  }
`;

const DropDownWrapper = styled.div`
  position: absolute;
  ${theme.common.flexCenterColumn}
  margin-top: 30px;
`;

const ButtonStyle = css`
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
`;

const Button = styled.button`
  ${ButtonStyle};
`;

const DropDownButton = styled.button`
  ${ButtonStyle};
  margin-top: 4px;
`;

const Notice = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 20px;
  left: 69px;
  background-color: #c24641;
  border-radius: 50%;
`;
