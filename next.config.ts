import type { NextConfig } from "next";

const repoBasePath = "/Motherhood-VLP";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // GitHub Pages is a static export and cannot host /api/leads.
  // A Node host keeps the server build so that route can create the lead.
  ...(isGithubPages
    ? { output: "export", basePath: repoBasePath, assetPrefix: repoBasePath }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages
      ? repoBasePath
      : process.env.NEXT_PUBLIC_BASE_PATH || "",
  },
};

export default nextConfig;
