import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from 'libs/db/mongodb';
import dbConnect from 'libs/db/mongoose';
import axios from 'axios';
import User from 'model/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'custom-email',
      name: 'email',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials?.password) return null;
        await dbConnect();
        try {
          const user = await User.findOne({
            email: credentials.email,
            password: credentials.password,
            provider: 'custom-email',
          });
          if (!user) {
            throw new Error('no user');
          }
          return { id: user._id.toString(), name: user.name, email: user.email, provider: user.provider };
        } catch {
          return null;
        }
      },
    }),
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
  session: { strategy: 'jwt' },
  // adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.provider = token.provider;
      return session;
    },
  },
});
