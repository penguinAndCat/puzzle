/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withNextBundleAnalyzer = require('next-bundle-analyzer');

const bundleAnalyzer = withNextBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

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

module.exports = withPlugins([bundleAnalyzer], nextConfig);
