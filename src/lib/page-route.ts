import type { VlpPageConfig } from "@/lib/vlp-schema";

type RoutableSite = Pick<VlpPageConfig["site"], "slug" | "route">;

/** Public URL segment for a landing page (falls back to internal slug). */
export function pageRoute(site: RoutableSite): string {
  return site.route ?? site.slug;
}