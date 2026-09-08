import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/clinical-assistant",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "X-FastMed-Release", value: "2026.09.08.5" },
        ],
      },
    ];
  },
};

export default nextConfig;
