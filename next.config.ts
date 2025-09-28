import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nirob.signalsmind.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '103.161.8.243',
        port: '4000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
