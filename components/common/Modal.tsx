import { useToast } from 'hooks/useToast';
import { setPuzzleRowColumn } from 'libs/puzzle/createPuzzle';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { CloseIcon } from './Icon';

const Modal = () => {
  const { offModal, modalImage, setModalImage, initialModalImage, setNumber } = useModal();
  const { fireToast } = useToast();
  const [roomName, setRoomName] = useState('');
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [puzzleNumbers, setPuzzleNumbers] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const closeModal = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    document.body.style.overflow = 'unset';
    offModal();
    initialModalImage();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
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

  const createPuzzle = () => {
    if (roomName === '') {
      fireToast({ content: '방 이름을 지어 주세요.', top: buttonRef.current?.getBoundingClientRect().top });
      return;
    }
    offModal();
    setNumber(puzzleNumber);
    router.push('/puzzle');
  };

  return (
    <OuterContainer onClick={(e) => closeModal(e)}>
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
        <CreateWrapper>
          <CreateButton ref={buttonRef} onClick={createPuzzle}>
            퍼즐 만들기
          </CreateButton>
        </CreateWrapper>
      </Container>
    </OuterContainer>
  );
};

export default Modal;

const OuterContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

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
  margin-top: 4px;
  ${ModalTheme}
  &:focus {
    outline: none;
  }
`;

const RoomNameWrapper = styled.div`
  width: 240px;
  display: flex;
  align-items: center;
  margin: 10px 0 0;
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
  display: flex;
  align-items: center;
  margin: 10px 0 0;
`;

const CreateWrapper = styled.div`
  ${theme.common.flexCenter}
  margin: 10px 0;
`;

const CreateButton = styled.button`
  width: 240px;
  height: 30px;
  cursor: pointer;
  ${ModalTheme}
`;
