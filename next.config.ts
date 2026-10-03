import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets you open the dev server from your phone on the same Wi-Fi
  // (e.g. http://172.20.10.4:3000) to test the customer menu.
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
