import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { exportConfig, initConfig, restartConfig } from '../libs/puzzle/createPuzzle';

interface Props {
  puzzleLv: number;
  puzzleImg: img;
}

const PuzzleCanvas = ({ puzzleLv, puzzleImg }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const imgResize = () => {
      if (window.innerWidth < window.innerHeight - 60) {
        setCanvasSize({ width: window.innerWidth, height: window.innerWidth });
      } else {
        setCanvasSize({ width: window.innerHeight - 60, height: window.innerHeight - 60 });
      }
    };

    window.addEventListener('resize', imgResize);
    imgResize();
    return () => {
      window.removeEventListener('resize', imgResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    if (canvasSize.width === 0 || canvasSize.width === 0) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const config = exportConfig();
    Paper.setup(canvas);
    initConfig(Paper, puzzleImg, config, canvasSize, puzzleLv);
  }, [puzzleImg, puzzleLv]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas === null) return;
  //   if (canvasSize.width === 0 || canvasSize.width === 0) return;
  //   canvas.width = canvasSize.width;
  //   canvas.height = canvasSize.height;
  //   const config = exportConfig();
  //   if (!config.firstClient) {
  //     Paper.projects = [];
  //     restartConfig(Paper, puzzleImg, canvasSize, puzzleLv);
  //   }
  // }, [canvasSize]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} id="canvas" style={{ width: canvasSize.width, height: canvasSize.height }} />
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

export default PuzzleCanvas;
