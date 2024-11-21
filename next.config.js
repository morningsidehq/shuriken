const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/**/*': ['./src/**/*'],
    },
  },
  images: {
    domains: ['rsms.me'],
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_next' : '',
  poweredByHeader: false,
  compress: true,
  serverRuntimeConfig: {
    port: process.env.PORT || 8080,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
