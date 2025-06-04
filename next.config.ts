import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    domains: ["lh3.googleusercontent.com", "avatar.vercel.sh"],
  },
  async rewrites() {
    return [
      {
        source: '/events', destination: '/dashboard/events',
      },
      {
        source: '/shared-events', destination: '/dashboard/shared-events',
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
      {
        source: '/privacy', destination: '/user/privacy',
      },
      {
        source: '/terms', destination: '/user/terms',
      },
    ];
  },
};

export default nextConfig;
