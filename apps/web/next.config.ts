import type { NextConfig } from "next";
import { remoteImagePatterns } from "./lib/remote-images";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  experimental: {
    typedEnv: true,
  },

  logging: {
    browserToTerminal: true,
    serverFunctions: true,
  },
  images: {
    // the list lives in lib/remote-images so components can check a photo
    // URL against it before handing it to next/image
    remotePatterns: remoteImagePatterns,
  },
};

export default nextConfig;
