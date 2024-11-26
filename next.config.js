const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const path = require('path')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbotrace: {
      logLevel: 'error',
      logDetail: true,
    },
  },
  images: {
    domains: ['rsms.me'],
    unoptimized: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_BASE_URL || '',
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
  distDir: '.next',
  generateBuildId: async () => {
    const timestamp = Math.floor(Date.now() / 1000)
    return `build${timestamp}`
  },
}

const config = withMDX(nextConfig)
module.exports = withBundleAnalyzer(config)
