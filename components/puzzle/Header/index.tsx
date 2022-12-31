import Palette from 'components/common/Palette';
import { useRoomInfo } from 'hooks/useRoomInfo';
import axios from 'libs/axios';
import { saveImage } from 'libs/common/saveImage';
import { exportConfig } from 'libs/puzzle/createPuzzle';
import { useLoading, useModal, usePuzzle } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import styled, { css } from 'styled-components';
import PuzzleMenu from './PuzzleMenu';

interface Props {
  setShowLevel: Dispatch<SetStateAction<boolean>>;
  setShowRoomInfo: Dispatch<SetStateAction<boolean>>;
  user: UserInfo | null;
}

const Header = ({ setShowLevel, setShowRoomInfo, user }: Props) => {
  const router = useRouter();
  const { addModal } = useModal();
  const { number, title, secretRoom } = usePuzzle();
  const { onLoading, offLoading } = useLoading();
  const { roomInfo } = useRoomInfo(router.query.id, user);

  const createPuzzleRoom = async () => {
    try {
      const content = {
        first: '퍼즐을 생성 중입니다.',
        second: '잠시만 기다려주세요.',
      };
      onLoading(content);

      const puzzleData = exportConfig();
      delete puzzleData.project;
      puzzleData.puzzleImage.src = await saveImage(puzzleData.puzzleImage.src);
      const data = {
        config: {
          ...puzzleData,
          groupTiles: puzzleData.groupTiles.map((item) => {
            return [item.tile.position.x, item.tile.position.y, item.groupIndex];
          }),
        },
        userId: user?.id,
        level: number,
        title: title,
        secretRoom: secretRoom,
        maximumPlayer: 4,
        perfection: 0,
      };

      const response = await axios.post('/api/puzzle', {
        data: data,
      });
      const { item, message } = response.data;
      window.location.href = `/puzzle/${item._id}`;
    } catch (err) {
      alert('failed');
      offLoading();
      console.log(err);
    }
  };

  const openModal = () => {
    addModal('puzzleFriend');
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          {router.query.id === undefined ? (
            <Button onClick={() => setShowLevel(true)}>퍼즐수</Button>
          ) : (
            <Button onClick={() => setShowRoomInfo(true)}>방 정보</Button>
          )}
        </Left>
        <Logo onClick={() => window.location.replace('/')}>
          <div>PENGCAT</div>
          <div>PUZZLE</div>
        </Logo>
        <Right>
          {router.query.id === undefined ? (
            <Button onClick={createPuzzleRoom}>방 만들기</Button>
          ) : (
            roomInfo && roomInfo.secretRoom && <Button onClick={openModal}>초대하기</Button>
          )}
          {router.query.id === undefined ? (
            <PuzzleMenu
              user={user}
              roomInfo={roomInfo}
              setShowLevel={setShowLevel}
              setShowRoomInfo={setShowRoomInfo}
              createPuzzleRoom={createPuzzleRoom}
            />
          ) : roomInfo && roomInfo.secretRoom ? (
            <PuzzleMenu
              user={user}
              roomInfo={roomInfo}
              setShowLevel={setShowLevel}
              setShowRoomInfo={setShowRoomInfo}
              createPuzzleRoom={createPuzzleRoom}
            />
          ) : (
            <MobileButton onClick={() => setShowRoomInfo(true)}>방 정보</MobileButton>
          )}
          <Palette />
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 60px;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.headerColor};
  border-bottom: solid 3px ${({ theme }) => theme.headerTextColor};
  @media (max-width: 600px) {
    padding: 0 10px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    padding: 0;
  }
`;

const Left = styled.div`
  min-width: 150px;
  margin-right: 80px;
  @media (max-width: 900px) {
    margin-right: 20px;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const Right = styled.div`
  min-width: 150px;
  display: flex;
  justify-content: end;
  margin-left: 80px;
  @media (max-width: 900px) {
    margin-left: 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
    min-width: 80px;
  }
`;

const ButtonStyle = css`
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const Button = styled.button`
  ${ButtonStyle};
  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileButton = styled.button`
  ${ButtonStyle};
`;

const Logo = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 0 80px;
  font-weight: 600;
  color: ${({ theme }) => theme.headerTextColor};
  cursor: pointer;
  @media (max-width: 900px) {
    margin: 0 20px;
  }
  @media (max-width: 600px) {
    width: 120px;
    margin: 0;
  }
`;
