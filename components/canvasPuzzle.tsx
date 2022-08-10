import { useRef, useState, useContext, useEffect, ChangeEvent, SetStateAction } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { initConfig } from '../libs/puzzle/createPuzzle';

const PuzzleCanvas = (props: any) => {
  const canvasRef = useRef(null);
  const [imgBase64, setImgBase64] = useState({ src: '/test.jpg', width: 330, height: 330 }); // 파일 base64

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas === null) return;
    Paper.setup(canvas);

    initConfig(Paper, imgBase64);
  }, []);

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
  useEffect(() => {
    initConfig(Paper, imgBase64);
  }, [imgBase64]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} id="canvas" />
      <div className="button">
        <label htmlFor="chooseFile" className="label">
          👉 CLICK HERE! 👈
        </label>
      </div>
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

export default PuzzleCanvas;
