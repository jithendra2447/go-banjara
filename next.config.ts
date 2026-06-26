import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/travel/kashmir',
        destination: '/travel/ladakh',
        permanent: false,
      },
      {
        source: '/travel/ladhak',
        destination: '/travel/ladakh',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
