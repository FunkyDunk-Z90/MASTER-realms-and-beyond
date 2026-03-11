import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@rnb/types', '@rnb/ui'],
};

export default nextConfig;
