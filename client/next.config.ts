import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  // Lets your phone load the dev site over Wi-Fi. Use your laptop's Network IP.
  allowedDevOrigins: ["192.168.254.38"],
};

export default nextConfig;