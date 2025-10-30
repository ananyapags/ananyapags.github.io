/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a fully static export (no Node.js server needed)
  output: 'export',

  // Helpful for GitHub Pages and other static hosts
  trailingSlash: true,

  // Disable the Image Optimization API during static export
  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
};

module.exports = nextConfig;


