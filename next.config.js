/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // forza www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'wearewineconnect.com' }],
        destination: 'https://www.wearewineconnect.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
