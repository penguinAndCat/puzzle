import { Button } from 'components/common/Button';
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
            <Button onClick={() => setShowLevel(true)} css={DropDownButtonCss}>
              퍼즐수
            </Button>
          ) : (
            <Button onClick={() => setShowRoomInfo(true)} css={DropDownButtonCss}>
              방 정보
            </Button>
          )}
          {router.query.id === undefined ? (
            <Button onClick={createPuzzleRoom} css={DropDownButtonCss}>
              방 만들기
            </Button>
          ) : (
            roomInfo &&
            roomInfo.secretRoom && (
              <Button onClick={() => addModal('puzzleFriend')} css={DropDownButtonCss}>
                초대하기
              </Button>
            )
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

const DropDownButtonCss = css`
  margin-top: 4px;
`;
