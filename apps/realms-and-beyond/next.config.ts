import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@rnb/assets', '@rnb/types', '@rnb/ui'],
};

export default nextConfig;
