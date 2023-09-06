const withImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = withImages({
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  output: 'standalone',
  images: {
    domains: ['skyswap.s3.amazonaws.com'],
  },
});

module.exports = nextConfig;
