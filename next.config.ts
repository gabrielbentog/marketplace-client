import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
{
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**", // Libera qualquer caminho no localhost:3000
      },
    ],
  },
};

export default nextConfig;
