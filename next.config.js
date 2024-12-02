// Enable bundle analyzer when ANALYZE environment variable is set to 'true'
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const path = require('path')

// Configure MDX support with default remark and rehype plugins
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as standalone build for production deployment
  output: 'standalone',

  // Configure experimental features
  experimental: {
    turbotrace: {
      logLevel: 'error',
      logDetail: true,
    },
    esmExternals: 'loose',
    serverComponentsExternalPackages: [
      'styled-jsx',
      '@babel/core',
      'onnxruntime-node',
    ],
  },

  // Image optimization configuration
  images: {
    domains: ['rsms.me'],
    unoptimized: true,
  },

  // Set asset prefix for CDN support
  assetPrefix: process.env.NEXT_PUBLIC_BASE_URL || '',

  // Disable "Powered by Next.js" header
  poweredByHeader: false,

  // Enable response compression
  compress: true,

  // Server runtime configuration
  serverRuntimeConfig: {
    port: process.env.PORT || 8080,
  },

  // Webpack configuration for path aliases and optimizations
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    }

    // Add resolver fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    }

    // Prevent server-side webpack from attempting to parse binary files
    if (isServer) {
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
        'styled-jsx': 'commonjs styled-jsx',
        '@babel/core': 'commonjs @babel/core',
      })
    }

    // Add rules to handle binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      type: 'javascript/auto',
    })

    return config
  },

  // Set build output directory
  distDir: '.next',

  // Generate unique build ID using timestamp
  generateBuildId: async () => {
    const timestamp = Math.floor(Date.now() / 1000)
    return `build${timestamp}`
  },

  // TypeScript and ESLint configurations for production
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Add support for MDX pages
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

// Apply MDX configuration
const config = withMDX(nextConfig)

// Export final configuration with bundle analyzer
module.exports = withBundleAnalyzer(config)
