export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://motherhoodvlp.com";
}

export function vlpPageUrl(route?: string) {
  const base = siteUrl();
  const path = route ? (route.startsWith("/") ? route : `/${route}`) : "";
  const subPath = basePath ? (basePath.startsWith("/") ? basePath : `/${basePath}`) : "";
  return `${base}${subPath}${path}`;
}