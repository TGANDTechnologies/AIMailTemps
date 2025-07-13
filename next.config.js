/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude pg from client bundle (only use on server)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
      };
    }
    return config;
  },
};

export default nextConfig;