import React, { useEffect, useState } from 'react';
import router from 'next/router';
import styled, { css } from 'styled-components';
import { AxiosError } from 'axios';

import apis from 'apis';
import CropImageModal from 'components/common/Modal/CropImageModal';
import ModalLayout from 'components/common/Modal/ModalLayout';
import { saveImage } from 'libs/common/saveImage';
import { useToast } from 'hooks/useToast';

export default function Profile({ user }: { user: UserInfo | null }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [profileImg, setProfileImg] = useState<string>(user?.picture || '');
  const [croppedImg, setCroppedImg] = useState<string>(user?.picture || '');
  const [nickname, setNickname] = useState<string>(user?.nickname || '');

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
    if (user?.picture !== croppedImg) {
      data.profileImage = croppedImg;
    }
    try {
      data.profileImage = await saveImage(croppedImg);
      const message = await apis.users.updateProfile(data);
      if (message === 'success') {
        router.replace(router.asPath);
        toast({ content: '프로필을 수정하였습니다.', type: 'success' });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message || 'Error');
      }
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <Container>
      <ProfileWrapper>
        {showModal && (
          <ModalLayout content={'cropImage'} setCloseModal={() => setShowModal(false)}>
            <CropImageModal
              setCloseModal={() => setShowModal(false)}
              profileImg={profileImg}
              croppedImg={croppedImg}
              setProfileImg={setProfileImg}
              setCroppedImg={setCroppedImg}
            />
          </ModalLayout>
        )}
        <ProfileImageBox>
          <Img
            src={profileImg}
            alt="profile"
            onClick={() => {
              setShowModal(true);
            }}
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
