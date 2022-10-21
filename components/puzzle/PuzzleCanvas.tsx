import { useRef, useState, useEffect, useContext } from 'react';
import Paper from 'paper';
import styled from 'styled-components';
import { exportConfig, initConfig, restartConfig } from 'libs/puzzle/createPuzzle';
import { useRouter } from 'next/router';

import axios from 'axios';
import { SocketContext } from 'libs/context/socket';
import { moveIndex } from 'libs/puzzle/socketMove';
import { useLoading, userStore } from 'libs/zustand/store';
import Pusher from 'pusher-js';
import { NEXT_SERVER } from 'config';

interface Props {
  puzzleLv: number;
  puzzleImg: img;
}

const PuzzleCanvas = ({ puzzleLv, puzzleImg }: Props) => {
  const { user } = userStore();
  const { offLoading } = useLoading();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const socket = useContext(SocketContext);
  let userNickname: string;
  if (user?.nickname) {
    userNickname = user.nickname;
  }

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
        offLoading();
      } else {
        if (userNickname === undefined) return;
        const response = await axios.get(`/api/puzzle?id=${router.query.id}`);
        const item = response.data.item;
        const config = { ...item.config };
        const puzzleImage = { ...config.puzzleImage };
        restartConfig(Paper, puzzleImage, config, canvasSize, item.level, router.query.id, socket, userNickname);
        offLoading();
      }
    };
    setPuzzle();
  }, [puzzleLv, router.isReady, puzzleImg, canvasSize, router.query.id, socket, user]);

  useEffect(() => {
    console.log(NEXT_SERVER);
    let subscribe = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY ? process.env.NEXT_PUBLIC_KEY : '', {
      cluster: 'ap3',
      authEndpoint: `${NEXT_SERVER}/api/pusher/auth`,
      auth: {
        params: {
          username: 'hi',
        },
      },
    });
    if (subscribe) {
      // subscribe to the channel.
      const channel: any = pusher.subscribe('presence-channel');
      // Now we can handle all event related to that channel. ==> using bind()
      // Ex. like when a user subscribes to the channel.
      channel.bind('pusher:subscription_succeeded', (members: Members) => {
        // console.log('count', members);
        // setOnlineUsersCount(members.count);
      });

      // when a new user join the channel.
      channel.bind('pusher:member_added', (member: Member) => {
        // console.log('channel', channel.members, member);
        // setOnlineUsersCount(channel.members.count);
        // setOnlineUsers((prev) => [...prev, { username: member.info.username }]);
      });

      // when someone send a message.
      channel.bind('movePuzzle', (data: any) => {
        const { groupTiles, indexArr, socketCanvasSize } = data;
        moveIndex(groupTiles, indexArr, socketCanvasSize);
        // if (data.userNickname !== userNickname) {
        //   moveIndex(groupTiles, indexArr, socketCanvasSize);
        // }
        // setChats((prev) => [...prev, { username, message }]);
      });
    }

    return () => {
      // last unsubscribe the user from the channel.
      pusher.unsubscribe('presence-channel');
      subscribe = false;
    };
  }, []);

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
