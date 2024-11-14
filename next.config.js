/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com']
  },
  experimental: {
    serverActions: true
  },
  async headers() {
    return [
      {
        // Allow CORS from Paystack
        source: '/api/webhooks',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, x-paystack-signature'
          }
        ]
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before pages/public files which allows overriding
        // page files
        {
          source: '/callback',
          destination: '/api/checkout/callback'
        }
      ]
    };
  }
};

module.exports = nextConfig;
