import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Required so Next.js processes image imports (png/jpg) from @rnb/assets
    transpilePackages: ['@rnb/assets'],
}

export default nextConfig
