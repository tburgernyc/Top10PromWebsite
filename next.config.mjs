/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@supabase/supabase-js',
      'recharts',
      'three',
      'gsap',
    ],
  },
  // Transpile Three.js for proper ESM handling
  transpilePackages: ['three'],
}

export default nextConfig
