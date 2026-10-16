/** Public URL segment for a landing page (falls back to internal slug). */
export function pageRoute(site) {
  return site.route ?? site.slug;
}