import { useRef, useState, useEffect } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { exportConfig, initConfig, restartConfig } from 'libs/puzzle/createPuzzle';
import { useRouter } from 'next/router';

import { movableIndex, moveIndex } from 'libs/puzzle/socketMove';
import { useLoading, usePuzzle, useSocket } from 'libs/zustand/store';
import Pusher from 'pusher-js';
import { NEXT_SERVER } from 'config';
import { useToast } from 'hooks/useToast';
import { useInvitedUser, usePuzzleFriend } from 'hooks/useReactQuery';
import axios from 'libs/axios';
import { useCanvasSize } from 'hooks/useResize';

interface Props {
  puzzleLv: number;
  puzzleImg: img;
  user: UserInfo | null;
}

const PuzzleCanvas = ({ puzzleLv, puzzleImg, user }: Props) => {
  const { offLoading } = useLoading();
  const { setParticipant } = useSocket();
  const { title } = usePuzzle();
  const canvasSize = useCanvasSize();
  const toast = useToast();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState();
  const { refetchInvitedUser } = useInvitedUser(router.query.id, user);
  const { refetchPuzzleFriend } = usePuzzleFriend(router.query.id);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    if (canvasSize.width === 0 || canvasSize.width === 0) return;

    const setPuzzle = async () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      Paper.setup(canvas);
      if (router.query.id === undefined) {
        const config = exportConfig();
        initConfig(Paper, puzzleImg, config, canvasSize, puzzleLv, title);
        offLoading();
      } else {
        if (socket === undefined) return;
        const response = await axios.get(`/api/puzzle/${router.query.id}`);
        const item = response.data.item;
        const config = { ...item.config };
        const puzzleImage = { ...config.puzzleImage };
        const puzzleTitle = item.title;
        restartConfig(Paper, puzzleImage, config, canvasSize, item.level, router.query.id, socket, puzzleTitle);
        offLoading();
      }
    };
    setPuzzle();
  }, [puzzleLv, puzzleImg, canvasSize, router.query.id, socket, user, offLoading, title]);

  useEffect(() => {
    if (!router.isReady) return;
    if (user === null) return;
    if (router.query.id === undefined) return;
    let subscribe = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY ? process.env.NEXT_PUBLIC_KEY : '', {
      cluster: 'ap3',
      authEndpoint: `${NEXT_SERVER}/api/pusher/auth`,
      auth: {
        params: {
          username: user?.nickname || '',
        },
      },
    });
    if (subscribe) {
      // subscribe to the channel.
      const channel: any = pusher.subscribe(`presence-${router.query.id}`);
      let socketId: string;
      channel.bind('pusher:subscription_succeeded', (members: Members) => {
        if (members.count > 4) {
          alert('인원 제한(4명)이 초과 하였습니다. 메인 페이지로 돌아갑니다.');
          window.location.href = '/';
        }
        setSocket(members.myID);
        socketId = members.myID;
        setParticipant(Object.values(members.members).map((item: any) => item.username));
      });

      // when a new user join the channel.
      channel.bind('pusher:member_added', (member: Member) => {
        toast({ nickname: `${member.info.username}`, content: `님이 입장하였습니다.`, type: 'info' });
        setParticipant(Object.values(channel.members.members).map((item: any) => item.username));
      });

      channel.bind('pusher:member_removed', (member: Member) => {
        toast({ nickname: `${member.info.username}`, content: `님이 퇴장하였습니다.`, type: 'info' });
        setParticipant(Object.values(channel.members.members).map((item: any) => item.username));
      });

      channel.bind('movePuzzle', (data: any) => {
        const { groupTiles, indexArr, socketCanvasSize } = data;
        if (data.socketId !== socketId) {
          moveIndex(groupTiles, indexArr, socketCanvasSize);
        }
      });

      channel.bind('movablePuzzle', (data: any) => {
        const { groupTiles } = data;
        if (data.socketId !== socketId) {
          movableIndex(groupTiles);
        }
      });

      channel.bind('invited', (data: any) => {
        const { puzzle, nickname } = data;
        if (puzzle) {
          refetchInvitedUser();
          refetchPuzzleFriend();
          toast({ nickname: `${nickname}`, content: `님이 퍼즐 방에 초대 되었습니다.`, type: 'info' });
        }
      });
    }

    return () => {
      // last unsubscribe the user from the channel.
      pusher.unsubscribe(`presence-${router.query.id}`);
      subscribe = false;
    };
  }, [router.isReady, router.query.id, setParticipant, user]);

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
  height: calc(100% - 61px);
  display: flex;
  justify-content: center;
`;

export default PuzzleCanvas;
