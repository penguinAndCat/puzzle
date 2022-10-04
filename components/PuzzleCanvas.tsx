import { useRef, useState, useEffect, useContext } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { exportConfig, initConfig, moveIndex, restartConfig } from '../libs/puzzle/createPuzzle';
import { useRouter } from 'next/router';

import axios from 'axios';
import { SocketContext } from 'libs/context/socket';

interface Props {
  puzzleLv: number;
  puzzleImg: img;
}

const PuzzleCanvas = ({ puzzleLv, puzzleImg }: Props) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const socket = useContext(SocketContext);

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
    if (!router.isReady) return;

    const setPuzzle = async () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      Paper.setup(canvas);
      if (router.query.id === undefined) {
        const config = exportConfig();
        initConfig(Paper, puzzleImg, config, canvasSize, puzzleLv);
      } else {
        const response = await axios.get(`/api/puzzle?id=${router.query.id}`);
        const item = response.data.item;
        const config = { ...item.config };
        const puzzleImage = { ...config.puzzleImage };
        restartConfig(Paper, puzzleImage, config, canvasSize, item.level, router.query.id, socket);
      }
    };
    setPuzzle();
  }, [puzzleLv, router.isReady, puzzleImg, canvasSize, router.query.id, socket]);

  useEffect(() => {
    if (!router.isReady) return;

    socket.emit('join', router.query.id);

    socket.on('groupTiles', (data) => {
      if (data.socketId !== socket.id) {
        moveIndex(data.groupTiles, data.indexArr, data.socketCanvasSize);
      }
    });

    // socket disconnet onUnmount if exists
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [router.isReady, router.query.id, socket]);

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
  border-left: 3px solid ${({ theme }) => theme.textColor};
  border-right: 3px solid ${({ theme }) => theme.textColor};
  border-bottom: 3px solid ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.bgColor};
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
`;

export default PuzzleCanvas;
