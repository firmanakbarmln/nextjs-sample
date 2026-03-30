/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Vulnerability: Strict mode disabled
  // Vulnerability: Allowing all image domains
  images: {
    domains: ['*'],
  },
  // Vulnerability: Exposing environment variables
  env: {
    DB_PASSWORD: 'Admin@12345',
    JWT_SECRET: 'secret123',
    API_KEY: 'sk-1234567890abcdef',
  },
};

module.exports = nextConfig;
