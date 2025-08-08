import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codeville.s3.ap-southeast-1.amazonaws.com"
      }
    ]
  }
};

export default nextConfig;
