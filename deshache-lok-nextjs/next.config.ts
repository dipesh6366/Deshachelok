import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevents this site from being embedded in an <iframe> on another
  // origin (clickjacking protection).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stops browsers from MIME-sniffing a response away from its declared
  // Content-Type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limits how much referrer information is sent to other origins.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disables access to sensitive browser APIs this app doesn't use.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
