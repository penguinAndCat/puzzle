import Header from 'components/common/Header';
import { NEXT_SERVER } from 'config';
import axios from 'libs/axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function MyPage({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');
  const router = useRouter();
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

  return (
    <div>
      <Head>
        <title>마이페이지</title>
      </Head>
      <Header user={user} />
      <Wrapper>
        <TabBox>
          <li
            onClick={() => {
              myRef.current!.style.display = 'block';
              myPageRef.current = 1;
              setData([]);
              setTab('my');
            }}
          >
            나의 방
          </li>
          <li
            onClick={() => {
              myRef.current!.style.display = 'block';
              setData([]);
              myPageRef.current = 1;
              setTab('invited');
            }}
          >
            초대된 방
          </li>
        </TabBox>
        <PuzzleContainer>
          <PuzzleHead>{tab === 'my' ? '나의 방' : '초대된 방'}</PuzzleHead>
          <div>
            <PuzzleWrapper>
              {data?.map((item: any, index) => (
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
      </Wrapper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { data } = await axios.get(`${NEXT_SERVER}/api/auth`, {
    headers: {
      Cookie: req.headers.cookie || '',
    },
  });
  if (!data.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }
  return {
    props: {
      user: data.user,
    },
  };
};

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

const PuzzleWrapper = styled.ul`
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  gap: 0.5rem;
  justify-content: center;
`;

const PuzzleCard = styled.li`
  width: 250px;
  height: 312px;
  border-radius: 4px;
  background-color: white;
  color: black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  p {
    word-break: break-all;
    white-space: normal;
  }
`;

const Wrapper = styled.div`
  padding: 10px;
`;

const ImgWrapper = styled.div`
  width: 250px;
  height: 250px;
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
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.25;
`;

const PuzzleTitle = styled.p`
  padding: 5px;
`;
