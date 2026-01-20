import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize HeroUI imports
  transpilePackages: ["@heroui/react", "@heroui/styles"],

  // Optimize bundle size
  experimental: {
    optimizePackageImports: ["@heroui/react"],
  },
};

export default nextConfig;
