import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const devConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      "https://6000-firebase-studio-1764064547455.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev",
    ],
  },
};

const nextConfig: NextConfig =
  process.env.NODE_ENV === "development"
    ? { ...baseConfig, ...devConfig }
    : baseConfig;

export default nextConfig;
