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
       {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const devConfig: NextConfig = {
  ...baseConfig,
  experimental: {
    // This property is still valid under experimental for some configurations.
    // We will leave it here but it may not be the one causing the issue.
    // The main fix is moving allowedDevOrigins outside.
  },
  // This is the correct placement for allowedDevOrigins in recent Next.js versions
  allowedDevOrigins: [
    "https://6000-firebase-studio-1764064547455.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev",
  ],
};

const nextConfig: NextConfig =
  process.env.NODE_ENV === "development"
    ? devConfig
    : baseConfig;

export default nextConfig;
