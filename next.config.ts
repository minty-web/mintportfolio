import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Project thumbnails are arbitrary external URLs supplied by the admin.
    unoptimized: true,
  },
};

export default nextConfig;
