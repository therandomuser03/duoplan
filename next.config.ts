import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    domains: ["lh3.googleusercontent.com", "avatar.vercel.sh"],
  },
  async rewrites() {
    return [
      {
        source: '/notes', destination: '/dashboard/notes',
      },
      {
        source: '/shared-notes', destination: '/dashboard/shared-notes',
      },
      {
        source: '/account', destination: '/user/account',
      },
      {
        source: '/notifications', destination: '/user/notifications',
      },
      {
        source: '/billing', destination: '/user/billing',
      },
      {
        source: '/feedback', destination: '/user/feedback',
      },
      {
        source: '/support', destination: '/user/support',
      },
    ];
  },
};

export default nextConfig;
