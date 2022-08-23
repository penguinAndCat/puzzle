import { useRef, useState, useContext, useEffect, ChangeEvent, SetStateAction } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { exportConfig, initConfig } from '../libs/puzzle/createPuzzle';

const PuzzleCanvas = () => {
  const canvasRef = useRef(null);
  const [imgBase64, setImgBase64] = useState({ src: '/test2.jpg', width: 1000, height: 1000 }); // 파일 base64
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [puzzleLevel, setPuzzleLevel] = useState(1); // 퍼즐 레벨

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const imgResize = () => {
      if (window.innerWidth < window.innerHeight) {
        setCanvasSize({ width: window.innerWidth, height: window.innerWidth });
      } else {
        setCanvasSize({ width: window.innerHeight, height: window.innerHeight });
      }
    };

    window.addEventListener('resize', imgResize);
    imgResize();
    return () => {
      window.removeEventListener('resize', imgResize);
    };
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas === null) return;
    if (canvasSize.width === 0 || canvasSize.width === 0) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const config = exportConfig();
    if (config.firstClient === false) {
      Paper.projects = [];
    }
    Paper.setup(canvas);
    initConfig(Paper, imgBase64, config, canvasSize, puzzleLevel);
  }, [canvasSize, imgBase64, puzzleLevel]);

  // const handleChangeFile = (event: any) => {
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     // 2. 읽기가 완료되면 아래코드가 실행됩니다.
  //     const base64 = reader.result;
  //     if (base64) {
  //       const img = new Image();
  //       img.src = base64.toString();
  //       img.onload = function () {
  //         setImgBase64({ src: base64.toString(), width: img.width, height: img.height }); // 파일 base64 상태 업데이트
  //       };
  //     }
  //   };
  //   if (event.target.files[0]) {
  //     reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
  //   }
  // };
  // useEffect(() => {
  //   initConfig(Paper, imgBase64);
  // }, [imgBase64]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} id="canvas" style={{ width: canvasSize.width, height: canvasSize.height }} />
      {/* <div className="button">
        <label htmlFor="chooseFile" className="label">
          👉 CLICK HERE! 👈
        </label>
      </div>
      <Input type="file" id="chooseFile" name="chooseFile" accept="image/*" onChange={handleChangeFile} /> */}
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
    </Wrapper>
  );
};

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #000000;
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
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
