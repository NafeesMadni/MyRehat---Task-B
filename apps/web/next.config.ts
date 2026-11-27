import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

// The Docker image resolves the env at boot through varlock/auto-load
const withVarlock = varlockNextConfigPlugin({ freezeIntoBundle: false });
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  output: "standalone",
  transpilePackages: ["shiki"],
  async rewrites() {
    return [
      { source: "/rpc/:path*", destination: "http://server:3000/rpc/:path*" },
      { source: "/api/auth/:path*", destination: "http://server:3000/api/auth/:path*" },
    ];
  },
};

export default withVarlock(nextConfig);
