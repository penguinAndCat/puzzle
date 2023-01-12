import { useRef, useEffect, useMemo } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { initConfig } from 'libs/puzzle/createPuzzle';

interface Props {
  puzzleLv: number;
  puzzleImg: img;
}

const PuzzleCanvas = ({ puzzleLv, puzzleImg }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useMemo(() => ({ width: 240, height: 240 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const setPuzzle = async () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      Paper.setup(canvas);
      initConfig(Paper, puzzleImg, canvasSize, puzzleLv, '404');
    };
    setPuzzle();
  }, [puzzleLv, puzzleImg, canvasSize]);

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
  border: 3px solid ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.bgColor};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

export default PuzzleCanvas;
