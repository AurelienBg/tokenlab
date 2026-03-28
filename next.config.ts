import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer requires canvas to be aliased to false
  turbopack: {
    resolveAlias: {
      canvas: { browser: './lib/empty.js' },
    },
  },
};

export default nextConfig;
