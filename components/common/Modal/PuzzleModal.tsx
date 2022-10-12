import axios from 'axios';
import Paper from 'paper';
import { useToast } from 'hooks/useToast';
import { exportConfig, initConfig, setPuzzleRowColumn } from 'libs/puzzle/createPuzzle';
import { theme } from 'libs/theme/theme';
import { useLoading, useModal, usePuzzle, userStore } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { saveImage } from 'libs/common/saveImage';
import { CloseIcon } from '../Icon';

const PuzzleModal = () => {
  const { removeModal, addModal } = useModal();
  const { modalImage, secretRoom, setModalImage, initialModal, setNumber, setTitle, setSecretRoom } = usePuzzle();
  const { onLoading } = useLoading();
  const { fireToast } = useToast();
  const [roomName, setRoomName] = useState('');
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [puzzleNumbers, setPuzzleNumbers] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user } = userStore();

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    removeModal('puzzle');
  };

  useEffect(() => {
    return () => {
      initialModal();
    };
  }, []);

  useEffect(() => {
    if (modalImage.src === '') return;
    const rowColumn = setPuzzleRowColumn(modalImage);
    setPuzzleNumbers(
      rowColumn.map(([row, col]) => {
        return row * col;
      })
    );
    setPuzzleNumber(rowColumn[0][0] * rowColumn[0][1]);
  }, [modalImage]);

  const onchangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const inputImage = () => {
    inputRef.current?.click();
  };

  const handleChangeFile = (event: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        const img = new Image();
        img.src = base64.toString();
        img.onload = function () {
          setModalImage({ src: base64.toString(), width: img.width, height: img.height }); // 파일 base64 상태 업데이트
        };
      }
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
    }
  };

  const playAlonePuzzle = () => {
    if (modalImage.src === '') {
      fireToast({ content: '퍼즐 이미지를 등록해주세요.', top: buttonRef.current?.getBoundingClientRect().top });
      return;
    }
    if (roomName === '') {
      fireToast({ content: '방 이름을 지어 주세요.', top: buttonRef.current?.getBoundingClientRect().top });
      return;
    }
    removeModal('puzzle');
    setNumber(puzzleNumber);
    setTitle(roomName);
    router.push('/puzzle');
  };

  const createPuzzleRoom = async () => {
    if (modalImage.src === '') {
      fireToast({ content: '퍼즐 이미지를 등록해주세요.', top: buttonRef.current?.getBoundingClientRect().top });
      return;
    }
    if (roomName === '') {
      fireToast({ content: '방 이름을 지어 주세요.', top: buttonRef.current?.getBoundingClientRect().top });
      return;
    }
    if (!user?.name) {
      addModal('login');
      return;
    }
    removeModal('puzzle');
    try {
      onLoading();
      const canvasSize = { width: 1000, height: 1000 };
      const canvas = document.createElement('canvas');
      Paper.setup(canvas);
      const config = exportConfig();
      initConfig(Paper, modalImage, config, canvasSize, puzzleNumber);

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
        userId: user.id,
        level: puzzleNumber,
        title: roomName,
        secretRoom: secretRoom,
      };

      const response = await axios.post('/api/puzzle', {
        data: data,
      });
      const { item, message } = response.data;
      console.log(item);
      router.push(`/puzzle/${item._id}`);
    } catch (err) {
      alert('failed');
      console.log(err);
    }
  };

  const onChangeRadio = (e: { target: { value: any } }) => {
    if (e.target.value === 0) {
      setSecretRoom(false);
    } else {
      setSecretRoom(true);
    }
  };

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleWrapper>
        <Close />
        <Title>Create</Title>
        <Close onClick={(e) => closeModal(e)} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Close>
      </TitleWrapper>
      <ImgWrapper>
        {modalImage.src === '' ? (
          <ImageButton onClick={inputImage}>퍼즐 이미지를 등록해주세요.</ImageButton>
        ) : (
          <Img onClick={inputImage} src={modalImage.src} />
        )}
        <Input ref={inputRef} type="file" accept="image/*" onChange={handleChangeFile} />
      </ImgWrapper>
      <RoomNameWrapper>
        <SubTitle>방 이름</SubTitle>
        <div>
          <RoomNameInput value={roomName} onChange={(e) => onchangeRoomName(e)} />
        </div>
      </RoomNameWrapper>
      <PuzzleNumberWrapper>
        <SubTitle>퍼즐 수</SubTitle>
        <Select onChange={(e) => setPuzzleNumber(parseInt(e.target.value))} value={puzzleNumber}>
          {puzzleNumbers.length !== 0 ? (
            puzzleNumbers.map((props, index) => (
              <option key={index} value={index}>
                {props}
              </option>
            ))
          ) : (
            <option value={0}>0</option>
          )}
        </Select>
      </PuzzleNumberWrapper>
      <SecretRoomWrapper>
        <RadioLabel>
          <RadioInput type={'radio'} name={'secretRoom'} value={0} onChange={onChangeRadio} defaultChecked />
          <RadioP>공개 방</RadioP>
        </RadioLabel>
        <RadioLabel>
          <RadioInput type={'radio'} name={'secretRoom'} value={1} onChange={onChangeRadio} />
          <RadioP>비밀 방</RadioP>
        </RadioLabel>
      </SecretRoomWrapper>
      <PlayAloneWrapper>
        <CreateButton ref={buttonRef} onClick={playAlonePuzzle}>
          혼자 하기
        </CreateButton>
      </PlayAloneWrapper>
      <CreateWrapper>
        <CreateButton ref={buttonRef} onClick={createPuzzleRoom}>
          방 만들기
        </CreateButton>
      </CreateWrapper>
    </Container>
  );
};

export default PuzzleModal;

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

const ModalTheme = css`
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 2px ${({ theme }) => theme.modalTextColor};
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

const ImgWrapper = styled.div`
  // max-height: min(calc(100vw - 332px), 600px);
  // max-width: min(calc(100vw - 332px), 600px);
  min-height: 300px;
  min-width: 300px;
  ${theme.common.flexCenter}
  border-bottom: solid 2px ${({ theme }) => theme.modalTextColor};
`;

const ImageButton = styled.button`
  width: 200px;
  height: 200px;
  text-align: center;
  cursor: pointer;
  ${ModalTheme}
`;

const Img = styled.img`
  width: 280px;
  height: 280px;
  object-fit: contain;
  cursor: pointer;
`;

const Input = styled.input`
  display: none;
`;

const Select = styled.select`
  height: 24px;
  ${ModalTheme}
  &:focus {
    outline: none;
  }
`;

const RoomNameWrapper = styled.div`
  width: 240px;
  height: 24px;
  display: flex;
  align-items: center;
  margin: 6px 0 0;
`;

const SubTitle = styled.div`
  margin-right: 12px;
`;

const RoomNameInput = styled.input`
  width: 120px;
  ${ModalTheme}
  &:focus {
    outline: none;
  }
`;

const PuzzleNumberWrapper = styled.div`
  width: 240px;
  height: 24px;
  display: flex;
  align-items: center;
  margin: 6px 0 0;
  align-items: center;
`;

const SecretRoomWrapper = styled.div`
  width: 240px;
  height: 24px;
  display: flex;
  align-items: center;
  margin: 6px 0 0;
`;

const RadioInput = styled.input`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.modalTextColor};
  border-radius: 2px;
  width: 18px;
  height: 18px;
  margin: 0;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${({ theme }) =>
      theme.modalColor}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: ${({ theme }) => theme.modalTextColor};
  }

  &:hover {
    cursor: pointer;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  margin-right: 16px;
`;

const RadioP = styled.p`
  margin-left: 4px;
`;

const PlayAloneWrapper = styled.div`
  ${theme.common.flexCenter}
  margin: 6px 0 0 0;
`;

const CreateWrapper = styled.div`
  ${theme.common.flexCenter}
  margin: 6px 0;
`;

const CreateButton = styled.button`
  width: 240px;
  height: 30px;
  cursor: pointer;
  ${ModalTheme}
`;
