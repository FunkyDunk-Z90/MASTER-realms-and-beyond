const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rnb/ui'],
  sassOptions: {
    loadPaths: [path.resolve(__dirname, 'node_modules/@rnb/styles')],
  },
}

module.exports = nextConfig
