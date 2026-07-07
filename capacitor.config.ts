import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ai.bodyvision.app",
  appName: "BodyVision AI",
  webDir: "out",
  backgroundColor: "#090909",
  server: {
    url: "https://spring-shoreline-157.fly.dev",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
