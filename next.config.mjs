/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This forces Next.js to prioritize the App Router
  experimental: {
    appDir: true,
  },
};

export default nextConfig;