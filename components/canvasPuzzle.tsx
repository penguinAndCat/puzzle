import { useRef, useState, useContext, useEffect } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { initConfig } from './createPuzzle';

const PuzzleCanvas = (props: any) => {
  const canvasRef = useRef(null);
  const { puzzleImg } = props;

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas === null) return;
    Paper.setup(canvas);

    initConfig(Paper);
  }, []);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} id="canvas" />
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
const ComponentImg = styled.img`
  z-index: 1;
  object-fit: scale-down;
  width: 80%;
  height: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
export default PuzzleCanvas;
