const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  images: {
    domains: ['rsms.me'],
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_next' : '',
}

module.exports = withBundleAnalyzer(nextConfig)
