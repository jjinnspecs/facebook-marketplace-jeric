import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tjvkcstzsxtmneqrqzgs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/listing-images/**',
      },
    ],
  },
};

export default nextConfig;
