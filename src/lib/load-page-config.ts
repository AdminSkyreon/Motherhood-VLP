import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { deepMerge } from "@/lib/deep-merge";
import { vlpPageSchema, type VlpPageConfig } from "@/lib/vlp-schema";
import { pageRoute } from "@/lib/page-route";

const BASE_CONFIG_FILE = "_base.json";
const DEFAULT_PAGE_ID = "rgc";

const dataDir = () => path.join(process.cwd(), "src", "data", "hospitals");

/** Config file keys from `src/data/hospitals/*.json` (excluding `_base.json`). */
export function getPageIds(): string[] {
  return readdirSync(dataDir())
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
}

/** @deprecated Use {@link getPageIds} or {@link getAllPageRoutes}. */
export function getAllPageSlugs(): string[] {
  return getAllPageRoutes();
}

export function loadPageConfig(pageId = DEFAULT_PAGE_ID): VlpPageConfig {
  const basePath = path.join(dataDir(), BASE_CONFIG_FILE);
  const slugPath = path.join(dataDir(), `${pageId}.json`);

  const base = JSON.parse(readFileSync(basePath, "utf8")) as Record<string, unknown>;
  const override = JSON.parse(readFileSync(slugPath, "utf8")) as Record<string, unknown>;
  const merged = deepMerge(base, override);

  return vlpPageSchema.parse(merged);
}

function loadAllPageEntries(): Array<{ pageId: string; config: VlpPageConfig }> {
  return getPageIds().map((pageId) => ({
    pageId,
    config: loadPageConfig(pageId),
  }));
}

/** Public URL routes for all landing pages. */
export function getAllPageRoutes(): string[] {
  return loadAllPageEntries().map(({ config }) => pageRoute(config.site));
}

export function loadPageConfigByRoute(route: string): VlpPageConfig {
  const match = loadAllPageEntries().find(({ config }) => pageRoute(config.site) === route);
  if (!match) {
    throw new Error(`No page config found for route "${route}"`);
  }
  return match.config;
}

export function getDefaultPageRoute(): string {
  const entries = loadAllPageEntries();
  const preferred = entries.find(({ pageId }) => pageId === DEFAULT_PAGE_ID);
  const entry = preferred ?? entries[0];
  if (!entry) {
    throw new Error("No page configs found in src/data/hospitals/");
  }
  return pageRoute(entry.config.site);
}

export function validateAllPageConfigs(): void {
  const routes = new Map<string, string>();

  for (const { pageId, config } of loadAllPageEntries()) {
    const route = pageRoute(config.site);
    const existing = routes.get(route);
    if (existing) {
      throw new Error(
        `Duplicate route "${route}" in src/data/hospitals/${pageId}.json and src/data/hospitals/${existing}.json`
      );
    }
    routes.set(route, pageId);
  }
}