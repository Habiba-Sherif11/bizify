/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: 'https://bizify-backend.onrender.com/api/v1/:path*',
        },
      ],
    };
  },

  // ✅ RECOMMENDED: Add headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ],
      },
    ];
  },

  // ✅ RECOMMENDED: Environment variable for backend URL
  // (makes it easy to switch between dev/staging/prod)
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bizify-backend.onrender.com',
  },
};

module.exports = nextConfig;