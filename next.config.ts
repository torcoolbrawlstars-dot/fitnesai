import type { NextConfig } from "next";

// NEXT_OUTPUT=standalone  → Fly.io (Node.js сервер)
// NEXT_OUTPUT=export      → Capacitor / iOS IPA (статика)
// default (не задан)      → Capacitor / iOS IPA
const outputMode = process.env.NEXT_OUTPUT as NextConfig["output"] | undefined;

const nextConfig: NextConfig = {
  output: outputMode ?? "export",
  trailingSlash: outputMode !== "standalone",
  images: { unoptimized: true },
};

export default nextConfig;
