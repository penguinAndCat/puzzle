import { AxiosError } from 'axios';
import Header from 'components/common/Header';
import RoomCard from 'components/common/RoomCard';
import { NEXT_SERVER } from 'config';
import axios from 'libs/axios';
import { saveImage } from 'libs/common/saveImage';
import Head from 'next/head';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function MyPage({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');
  const [data, setData] = useState<any[]>([]);
  const myRef = useRef<HTMLDivElement>(null);
  const myPageRef = useRef(1);
  const [myLoading, setMyLoading] = useState(false);
  const [profileImg, setProfileImg] = useState<string>(user?.picture || '');
  const [nickname, setNickname] = useState<string>(user?.nickname || '');
  const inputFileRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>마이페이지</title>
      </Head>
      <Header user={user} />
      <Wrapper>
        <ProfileWrapper>
          <Title>프로필</Title>
          <ProfileBox>
            <Profile>
              <ProfileImageBox>
                <img
                  src={profileImg}
                  alt="profile"
                  onClick={() => {
                    if (!inputFileRef.current) return;
                    inputFileRef.current.click();
                  }}
                />
                <input
                  type="file"
                  multiple={false}
                  ref={inputFileRef}
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    if (!e.target.files) {
                      return;
                    }
                    const reader = new FileReader();
                    reader?.readAsDataURL(e.target.files[0]);
                    reader.onload = () => {
                      setProfileImg(String(reader.result));
                    };
                  }}
                />
              </ProfileImageBox>
              <ProfileText>
                <div>
                  이메일: <span>{`${user?.email}`}</span>
                </div>
                <div>
                  이름: <span>{`${user?.name}`}</span>
                </div>
                <div>
                  닉네임: <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
              </ProfileText>
              <div style={{ width: '100%' }}>
                <button
                  disabled={user?.nickname === nickname && profileImg === user.picture}
                  type="button"
                  style={{ width: '50%' }}
                  onClick={async (e) => {
                    const data: { nickname: string; profileImage: string } = {
                      nickname: '',
                      profileImage: '',
                    };
                    if (user?.nickname !== nickname) {
                      data.nickname = nickname;
                    }
                    if (user?.picture !== profileImg) {
                      data.profileImage = profileImg;
                    }
                    try {
                      await axios.put('/api/users', data);
                    } catch (err) {
                      if (err instanceof AxiosError) {
                        alert(err.response?.data.message || 'error');
                      }
                    }
                  }}
                >
                  수정하기
                </button>
                <button
                  type="button"
                  style={{ width: '50%' }}
                  onClick={() => {
                    setProfileImg(user?.picture || '');
                    setNickname(user?.nickname || '');
                  }}
                >
                  되돌리기
                </button>
              </div>
            </Profile>
          </ProfileBox>
        </ProfileWrapper>
        <TabBox>
          <li
            onClick={() => {
              if (tab === 'my') return;
              myPageRef.current = 1;
              setData([]);
              setTab('my');
            }}
          >
            나의 방
          </li>
          <li
            onClick={() => {
              if (tab === 'invited') return;
              setData([]);
              myPageRef.current = 1;
              setTab('invited');
            }}
          >
            초대된 방
          </li>
        </TabBox>
        <Title>{tab === 'my' ? '나의 방' : '초대된 방'}</Title>
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

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  margin-bottom: 1rem;
`;

const ProfileBox = styled.div`
  width: 80%;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Profile = styled.div`
  display: flex;
  padding: 0.25rem;
  flex-wrap: wrap;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.5);
`;

const ProfileText = styled.div`
  padding: 0.5rem;
`;

const ProfileImageBox = styled.div`
  width: 150px;
  height: 150px;
  img {
    width: 100%;
    cursor: pointer;
    object-position: 50% 50%;
    aspect-ratio: 1;
    object-fit: cover;
  }
  input[type='file'] {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
  width: 100%;
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
  padding: 10px;
  width: 100%;
`;
