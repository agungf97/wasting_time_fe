import type { NextConfig } from "next";
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_URL).hostname,
      },
    ],
  },
  env: {
    TZ: "Asia/Jakarta",
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["*.devtunnels.ms", "localhost:3000"],
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
