import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better compatibility
  experimental: {
    optimizePackageImports: ['tailwind-merge', 'clsx', 'lucide-react'],
    // Force webpack for all builds
    webpackBuildWorker: false,
  },
  // Disable Turbopack completely - use webpack only
  turbopack: {
    // Disable turbopack to force webpack usage
    enabled: false,
  },
  // Server external packages - fix MapLibre GL conflict
  serverExternalPackages: ['@supabase/supabase-js', 'maplibre-gl'],

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 414, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com', 'api.supabase.co'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300', // 5 minutes
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Webpack optimization for better bundling
  webpack: (config, { isServer }) => {
    // Optimize lucide-react imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': 'lucide-react/dist/esm/icons/index.js',
    }

    // Fix MapLibre GL module resolution for client-side
    if (!isServer) {
      // Ensure MapLibre GL is properly bundled
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'fs': false,
        'path': false,
        'crypto': false,
      }
    }

    // Improve bundle splitting for better caching
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            maplibre: {
              test: /[\\/]node_modules[\\/](maplibre-gl|@vis.gl)[\\/]/,
              name: 'maplibre',
              chunks: 'all',
              priority: 20,
              enforce: true,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      }
    }

    return config
  },
};

export default nextConfig;
