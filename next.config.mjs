/** @type {import('next').NextConfig} */
const repoBasePath = '/Motherhood-VLP';
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  ...(isGithubPages
    ? { basePath: repoBasePath, assetPrefix: repoBasePath }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : '',
  },
};

export default nextConfig;