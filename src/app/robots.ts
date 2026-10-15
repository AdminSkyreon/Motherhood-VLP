import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motherhoodvlp.com";

  const sitemapPath = basePath ? `${basePath}/sitemap.xml` : "/sitemap.xml";
  const allowPath = basePath ? `${basePath}/` : "/";

  return {
    rules: {
      userAgent: "*",
      allow: allowPath,
    },
    sitemap: `${siteUrl}${sitemapPath}`,
  };
}