import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

// The Docker image resolves the env at boot through varlock/auto-load
const withVarlock = varlockNextConfigPlugin({ freezeIntoBundle: false });

import type { NextConfig } from "next";

const serverUrl =
	process.env.SERVER_URL ??
	process.env.NEXT_PUBLIC_SERVER_URL ??
	"http://localhost:3000";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	output: "standalone",
	transpilePackages: ["shiki"],
	async rewrites() {
		return [
			{ source: "/rpc/:path*", destination: `${serverUrl}/rpc/:path*` },
			{
				source: "/api/auth/:path*",
				destination: `${serverUrl}/api/auth/:path*`,
			},
			{
				source: "/api/webhooks/:path*",
				destination: `${serverUrl}/api/webhooks/:path*`,
			},
		];
	},
};

export default withVarlock(nextConfig);
