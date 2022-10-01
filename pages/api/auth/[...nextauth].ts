import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from 'libs/db/mongodb';
import dbConnect from 'libs/db/mongoose';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 60 * 60 * 2,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.userId = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.provider = token.provider;
      session.user.id = token.userId;
      return session;
    },
  },
});
