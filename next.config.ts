import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
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
        protocol: 'https',
        hostname: 'nirob.signalsmind.com/s1',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '103.161.8.243',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'christmas-inside-workstation-irrigation.trycloudflare.com',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
    
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/api/video-proxy/:path*',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: '*',
  //         },
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: 'GET, POST, PUT, DELETE, OPTIONS',
  //         },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: 'Content-Type, Authorization',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
