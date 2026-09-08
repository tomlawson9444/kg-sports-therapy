import type { NextConfig } from "next";

const REPO_NAME = "kg-sports-therapy";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: `/${REPO_NAME}`,
  assetPrefix: `/${REPO_NAME}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
