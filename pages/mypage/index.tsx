import Header from 'components/common/Header';
import RoomCard from 'components/common/RoomCard';
import { NEXT_SERVER } from 'config';
import axios from 'libs/axios';
import Head from 'next/head';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function MyPage({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');
  const [data, setData] = useState<any[]>([]);
  const myRef = useRef<HTMLDivElement>(null);
  const myPageRef = useRef(1);
  const [myLoading, setMyLoading] = useState(false);

  const getMoreMyPuzzle = useCallback(async () => {
    try {
      if (!user?.id) {
        return;
      }
      setMyLoading(true);
      const response = await axios.get('/api/puzzle/myPuzzle', {
        params: {
          id: user?.id,
          page: myPageRef.current,
        },
      });
      const { item } = response.data;
      if (!item || item.length < 10) {
        myRef.current!.style.display = 'none';
      }
      myPageRef.current += 1;
      setData((prev) => [...prev, ...item]);
    } catch (err) {
      console.log(err);
    }

    setMyLoading(false);
  }, [user?.id]);

  const getMoreInvited = useCallback(async () => {
    try {
      if (!user?.id) {
        return;
      }
      setMyLoading(true);
      const response = await axios.get('/api/puzzle/invited', {
        params: {
          id: user?.id,
          page: myPageRef.current,
        },
      });
      const { item } = response.data;
      if (!item || item.length < 10) {
        myRef.current!.style.display = 'none';
      }
      myPageRef.current += 1;
      setData((prev) => [...prev, ...item]);
    } catch (err) {
      console.log(err);
    }

    setMyLoading(false);
  }, [user?.id]);

  const isIntersect: IntersectionObserverCallback = useCallback(
    async (entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        tab === 'my' ? await getMoreMyPuzzle() : await getMoreInvited();
        observer.observe(entries[0].target);
      }
    },
    [getMoreInvited, getMoreMyPuzzle, tab]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    if (myRef.current) {
      observer = new IntersectionObserver(isIntersect, {
        rootMargin: '-10px',
      });
      observer.observe(myRef.current);
    }
    return () => observer && observer.disconnect();
  }, [isIntersect, myRef]);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.style.display = 'block';
    }
  }, [tab]);

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <Header user={user} />
      <Wrapper>
        <TabBox>
          <li
            onClick={() => {
              myPageRef.current = 1;
              setData([]);
              setTab('my');
            }}
          >
            나의 방
          </li>
          <li
            onClick={() => {
              setData([]);
              myPageRef.current = 1;
              setTab('invited');
            }}
          >
            초대된 방
          </li>
        </TabBox>
        <PuzzleHead>{tab === 'my' ? '나의 방' : '초대된 방'}</PuzzleHead>
        <PuzzleContainer>
          {data?.map((item: any, index) => (
            <RoomCard
              key={index}
              src={item.config.puzzleImage.src}
              currentPlayer={item.player.length + 1}
              maxPlayer={item.maximumPlayer}
              progress={Number((item.perfection * 100).toFixed(3))}
              title={item.title}
              isPrivate={item.secretRoom}
              invitedList={item.secretRoom ? item.invitedUser : null}
              participantList={item.secretRoom ? item.player : null}
              onClick={() => {
                window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
              }}
            />
          ))}
          <div ref={myRef} />
        </PuzzleContainer>
      </Wrapper>
    </>
  );
}

const PuzzleContainer = styled.div`
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  @media (max-width: 1440px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TabBox = styled.ul`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  & > li {
    padding: 10px;
    background-color: white;
    color: black;
    cursor: pointer;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  border-bottom: 1px solid black;
`;

const Wrapper = styled.div`
  padding: 1rem;
  width: 100%;
`;

const PuzzleHead = styled.h2`
  text-align: center;
  display: inline-block;
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.25;
  padding: 0.5rem;
`;
