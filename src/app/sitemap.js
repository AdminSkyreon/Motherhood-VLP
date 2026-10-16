import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export default function sitemap() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motherhoodvlp.com";
  const now = new Date();

  let routes = [];
  try {
    const hospitalsDir = path.join(process.cwd(), "src", "data", "hospitals");
    const filenames = fs.readdirSync(hospitalsDir);
    routes = filenames
      .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
      .map((file) => file.replace(/\.json$/, ""));
  } catch (error) {
    routes = ["bangalore"];
  }

  const homePath = basePath ? `${basePath}/` : "/";
  const homeUrl = `${siteUrl}${homePath}`;

  return [
    {
      url: homeUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${siteUrl}${basePath ? `${basePath}/${route}` : `/${route}`}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route === routes[0] ? 0.9 : 0.8,
    })),
  ];
}