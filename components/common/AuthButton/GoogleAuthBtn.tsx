import jwtDecode from 'jwt-decode';
import axios from 'libs/axios';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function GoogleAuthBtn() {
  const router = useRouter();
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

  return <GoogleAuth onClick={onGoogleSignIn}>구</GoogleAuth>;
}

const Btn = styled.button`
  z-index: 1;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 0;
  line-height: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  border: 1px solid lightgray;
  &:hover {
    border: 1px solid skyblue;
  }
`;

const GoogleAuth = styled(Btn)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/btn_google.svg');
`;
