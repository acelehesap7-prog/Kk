/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  output: 'export',
  basePath: '/Kk',
  trailingSlash: true,
  assetPrefix: '/Kk'
}

module.exports = nextConfig
