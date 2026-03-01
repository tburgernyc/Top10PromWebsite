/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    // Restrict image optimization to defined domains only (GHSA-9g9p-9gw9-jx7f mitigation)
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
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
