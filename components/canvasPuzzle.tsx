import { useRef, useState, useContext, useEffect, ChangeEvent, SetStateAction } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { initConfig } from '../libs/puzzle/createPuzzle';

const PuzzleCanvas = (props: any) => {
  const canvasRef = useRef(null);
  const [imgBase64, setImgBase64] = useState({ src: '/test.jpg', width: 330, height: 330 }); // 파일 base64
  const [puzzleLevel, setPuzzleLevel] = useState(2); // 퍼즐 레벨

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas === null) return;
    Paper.setup(canvas);

    initConfig(Paper, imgBase64, puzzleLevel);
  }, [imgBase64, puzzleLevel]);

  const handleChangeFile = (event: any) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        const img = new Image();
        img.src = base64.toString();
        img.onload = function () {
          setImgBase64({ src: base64.toString(), width: img.width, height: img.height }); // 파일 base64 상태 업데이트
        };
      }
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
    }
  };

  return (
    <Wrapper>
      <Canvas ref={canvasRef} id="canvas" />
      <ButtonBox className="button">
        <label htmlFor="chooseFile" className="label">
          👉 CLICK HERE! 👈
        </label>
        <button onClick={() => setPuzzleLevel(1)}>1</button>
        <button onClick={() => setPuzzleLevel(2)}>2</button>
        <button onClick={() => setPuzzleLevel(3)}>3</button>
        <button onClick={() => setPuzzleLevel(4)}>4</button>
        <button onClick={() => setPuzzleLevel(5)}>5</button>
      </ButtonBox>
      <Input type="file" id="chooseFile" name="chooseFile" accept="image/*" onChange={handleChangeFile} />
    </Wrapper>
  );
};

const Canvas = styled.canvas`
  position: absolute;
  width: 1100px;
  height: 1100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  border: 2px solid #000000;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Input = styled.input`
  display: none;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
`;
export default PuzzleCanvas;
