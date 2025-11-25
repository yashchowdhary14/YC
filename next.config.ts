import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow cross-origin requests from the development environment.
  ...(process.env.NODE_ENV === 'development'
    ? {
        experimental: {
          allowedDevOrigins: [
            // This is the domain of your Firebase Studio development environment.
            'https://6000-firebase-studio-1764064547455.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev',
          ],
        }
      }
    : {}),
};

export default nextConfig;
