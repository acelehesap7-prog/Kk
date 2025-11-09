/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the default server output (remove static export) so App Router
  // API routes and server-side features work correctly on Vercel.
  // Add trailing slashes for cleaner URLs
  trailingSlash: true,
  // GitHub Pages deployment configuration
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  // Module import aliases
  experimental: {
    appDir: true,
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
