import withPWA from 'next-pwa';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const baseConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

const nextConfig = withPWA({
  dest: 'public',
  disable: isDev,
})(baseConfig);

export default nextConfig;
