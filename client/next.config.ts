import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: false,
  // Hides the "compiling/rendering" badge in dev. Delete this line to get it back.
  devIndicators: false,
  // Lets your phone load the dev site over Wi-Fi. Use your laptop's Network IP.
  allowedDevOrigins: ["192.168.254.38"],
  // Sends /api/* to the Express API so the login cookie is first-party (iPhone-safe).
  // Only active when API_ORIGIN is set (Vercel), so local dev is unchanged.
  async rewrites() {
    if (!apiOrigin) return [];
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
};

export default nextConfig;