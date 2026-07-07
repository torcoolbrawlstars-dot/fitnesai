import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* статический экспорт — нужен для Android-приложения (Capacitor) */
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
