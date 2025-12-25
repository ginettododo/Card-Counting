import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const runtimeCaching = [
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/drills'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'drills-pages',
      networkTimeoutSeconds: 1,
      expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'document',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages',
      networkTimeoutSeconds: 1,
      expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
    },
  },
  {
    urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'assets',
      expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 7 },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'image',
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname === '/manifest.json' || url.pathname === '/icon.svg',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'pwa-metadata',
      expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
];

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
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
})(baseConfig);

export default nextConfig;
