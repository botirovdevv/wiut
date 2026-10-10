import type { NextConfig } from "next";

// Hackathon rules forbid fake demos: refuse to produce a production build with mock mode on.
// (lib/api.ts also hard-disables mocks when NODE_ENV=production; this makes the mistake loud.)
const isProductionBuild =
  process.env.NODE_ENV === "production" ||
  process.argv.includes("build") ||
  Boolean(process.env.VERCEL);
if (isProductionBuild && process.env.NEXT_PUBLIC_MOCK === "1") {
  throw new Error(
    "NEXT_PUBLIC_MOCK=1 is not allowed in production builds. Unset it (mock mode is dev-only).",
  );
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
