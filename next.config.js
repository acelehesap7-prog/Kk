/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static HTML export for GitHub Pages
  output: "export",
  distDir: "out",
  // Add trailing slashes for cleaner URLs
  trailingSlash: true,
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? '/Kk' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Kk/' : '',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  // Skip type checking during builds for faster deployment
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true
};

module.exports = nextConfig;
