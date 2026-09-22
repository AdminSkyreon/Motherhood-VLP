/** Prefix public asset paths when deployed under a GitHub Pages project subpath. */
export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;

  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
