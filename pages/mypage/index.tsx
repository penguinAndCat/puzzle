import Header from 'components/common/Header';
import axios from 'libs/axios';
import { userStore } from 'libs/zustand/store';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function MyPage() {
  const { user, setUser } = userStore();
  const router = useRouter();
  const [myPuzzles, setMyPuzzles] = useState<any[]>([]);
  const myRef = useRef<HTMLDivElement>(null);
  const myPageRef = useRef(1);
  const [myLoading, setMyLoading] = useState(false);

  useEffect(() => {
    if (user?.name) return;
    axios
      .get('/api/auth')
      .then((res) => {
        const loginUser = res.data.user;
        if (loginUser) {
          setUser({ ...loginUser });
          return;
        }
        router.replace('/');
      })
      .catch((err) => {
        console.log(err);
        router.replace('/');
      });
  }, [router, setUser, user?.name]);

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
      console.log(item);
      setMyPuzzles((prev) => [...prev, ...item]);
    } catch (err) {
      console.log(err);
    }

    setMyLoading(false);
  }, [user?.id]);

  const isIntersect: IntersectionObserverCallback = useCallback(
    async (entries, observer) => {
      if (entries[0].isIntersecting && !myLoading) {
        observer.unobserve(entries[0].target);
        await getMoreMyPuzzle();
      }
    },
    [getMoreMyPuzzle, myLoading]
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
    console.log(myPuzzles);
  }, [myPuzzles]);

  return (
    <div>
      <Head>
        <title>마이페이지</title>
      </Head>
      <Header />
      <Wrapper>
        <PuzzleContainer>
          <PuzzleHead>my room</PuzzleHead>
          <div>
            <PuzzleWrapper>
              {myPuzzles?.map((item: any, index) => (
                <PuzzleCard key={index}>
                  <ImgWrapper>
                    <img src={item.config.puzzleImage.src} alt={'puzzleimg'} />
                  </ImgWrapper>
                  <div>
                    <PuzzleTitle>{item.title}</PuzzleTitle>
                  </div>
                </PuzzleCard>
              ))}
            </PuzzleWrapper>
            <div ref={myRef} />
          </div>
        </PuzzleContainer>
        <PuzzleContainer>
          <PuzzleHead>invited room</PuzzleHead>
          <div>
            <PuzzleWrapper></PuzzleWrapper>
          </div>
        </PuzzleContainer>
      </Wrapper>
    </div>
  );
}

const PuzzleWrapper = styled.ul`
  overflow-x: hidden;
  overflow-y: auto;
  height: 320px;
  background-color: white;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  gap: 0.5rem;
  justify-content: center;
`;

const PuzzleCard = styled.li`
  width: 250px;
  height: 300px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};

  p {
    word-break: break-all;
    white-space: normal;
  }
`;

const Wrapper = styled.div`
  padding-block: 10px;
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 5px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: contain;
  }
`;

const PuzzleContainer = styled.div``;

const PuzzleHead = styled.h2`
  text-align: center;
  display: inline-block;
  width: 100%;
  font-size: 4rem;
  font-weight: bold;
  line-height: 1.25;
`;

const PuzzleTitle = styled.p`
  text-align: center;
`;
