import React from 'react';
import styled from 'styled-components';

export default function GoogleAuthBtn() {
  const onGoogleSignIn = async () => {
    try {
      window.location.assign(
        'https://accounts.google.com/o/oauth2/v2/auth' +
          '?client_id=' +
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID +
          '&redirect_uri=' +
          process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI +
          '&response_type=token' +
          '&scope=' +
          ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(
            ' '
          )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BtnWrapper onClick={onGoogleSignIn}>
      <AuthWrapper>
        <GoogleAuth />
      </AuthWrapper>
      <div>구글로 시작</div>
    </BtnWrapper>
  );
}

const BtnWrapper = styled.div`
  width: 185px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #4285f4;
  font-size: 12px;
  cursor: pointer;
  border-radius: 0.25rem;
  margin-bottom: 8px;
`;

const AuthWrapper = styled.div`
  padding: 1px 6px;
`;

const Btn = styled.button`
  z-index: 1;
  background-color: #fff;
  border: none;
  width: 32px;
  height: 32px;
  background-position: center;
  color: #000;
`;

const GoogleAuth = styled(Btn)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/btn_google.svg');
  background-size: 50px;
  border-radius: 50%;
`;
