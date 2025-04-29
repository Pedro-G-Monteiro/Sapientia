// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['localhost'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },

  // Proxy client calls at /api/* to your auth-service
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },

  transpilePackages: ['antd', '@ant-design/icons'],

  // so you can still read it in client code if you ever need it
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default nextConfig
