/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    LOCAL_SERVER: 'http://localhost:3000',
    PROD_SERVER: 'https://pengcatpuzzle.vercel.app',
  },
};

module.exports = nextConfig;
