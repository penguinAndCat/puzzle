import { AxiosError } from 'axios';
import axios from 'libs/axios';
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

export default function Profile({ user }: { user: UserInfo | null }) {
  const [profileImg, setProfileImg] = useState<string>(user?.picture || '');
  const [nickname, setNickname] = useState<string>(user?.nickname || '');
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onClickInputButton = async () => {
    if (nickname.length > 5) {
      alert('닉네임은 5글자 이하입니다');
    }
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
        alert(err.response?.data.message || 'Error');
      }
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const reader = new FileReader();
    reader?.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfileImg(String(reader.result));
    };
  };

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <Container>
      <ProfileWrapper>
        <ProfileImageBox>
          <Img
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
            onChange={(e) => onChangeInput(e)}
          />
        </ProfileImageBox>
        <Content>
          <ProfileText>
            <Text>
              <Div>닉네임</Div>
              <span>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={5} />
              </span>
            </Text>
            <Text>
              <Div>이메일</Div>
              <span>{`${user?.email}`}</span>
            </Text>
            <Text>
              <Div>이름</Div>
              <span>{`${user?.name}`}</span>
            </Text>
          </ProfileText>
          <ButtonWrapper>
            <Button
              disabled={user?.nickname === nickname && profileImg === user.picture}
              type="button"
              onClick={onClickInputButton}
            >
              수정하기
            </Button>
            <Button
              disabled={user?.nickname === nickname && user.picture === profileImg}
              type="button"
              onClick={() => {
                setProfileImg(user?.picture || '');
                setNickname(user?.nickname || '');
              }}
            >
              되돌리기
            </Button>
          </ButtonWrapper>
        </Content>
      </ProfileWrapper>
    </Container>
  );
}

const ProfileStyle = css`
  background-color: ${({ theme }) => theme.profileColor};
  color: ${({ theme }) => theme.profileTextColor};
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  // border-bottom: 3px solid ${({ theme }) => theme.profileTextColor};
  margin-bottom: 1rem;
  padding: 4rem 0 2rem 0;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Content = styled.div``;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const ProfileText = styled.div``;

const ProfileImageBox = styled.div`
  margin-right: 40px;
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

const Img = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const Text = styled.div`
  ${ProfileStyle};
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const Div = styled.div`
  width: 60px;
  margin-right: 6px;
`;

const Input = styled.input`
  ${ProfileStyle};
  border: solid 2px ${({ theme }) => theme.profileTextColor};
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  ${ProfileStyle};
  border: solid 3px ${({ theme }) => theme.profileTextColor};
  cursor: pointer;
  width: 80px;
  height: 30px;
  margin-right: 10px;
  border-radius: 4px;
  font-weight: 600;
`;
