import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Se suas imagens reais vierem de outro lugar (ex: AWS S3, Cloudinary),
      // adicione o domínio aqui também. Exemplo:
      // {
      //   protocol: "https",
      //   hostname: "meu-bucket.s3.amazonaws.com",
      // },
    ],
  },
};

export default nextConfig;