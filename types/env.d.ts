declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: string;
    NEXT_PUBLIC_KAKAO_CLIENT_ID: string;
    NEXT_PUBLIC_KAKAO_CLIENT_SECRET: string;
    NEXT_PUBLIC_NAVER_CLIENT_ID: string;
    NEXT_PUBLIC_NAVER_CLIENT_SECRET: string;
    NEXT_PUBLIC_CLOUDINARY_NAME: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_ISSUER: string;
  }
}
