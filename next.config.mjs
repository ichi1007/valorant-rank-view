/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://game-rank.ichi10.com'
  },

  swcMinify: true,
};

export default nextConfig;
