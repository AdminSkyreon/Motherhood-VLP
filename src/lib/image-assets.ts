import { basePath, vlpPageUrl } from "@/lib/site";

const SOURCE_PATTERN = /\.(png|webp)$/i;

/** Logical public path with `.webp` extension (PNG sources only). */
export function webpAssetPath(path: string): string {
  return /\.png$/i.test(path) ? path.replace(/\.png$/i, ".webp") : path;
}

/** Base-path-aware URL for optimized WebP sibling of a PNG asset. */
export function webpAssetUrl(path: string): string {
  return path.startsWith("http") ? path : vlpPageUrl(webpAssetPath(path));
}

/** Responsive asset basename without extension, e.g. `/rgc/hero-mother-baby-banner`. */
export function responsiveBasename(assetPath: string): string {
  return assetPath.replace(SOURCE_PATTERN, "");
}

export const HERO_WIDTHS = [640, 960, 1200, 1600, 1920] as const;
export const HERO_MOBILE_WIDTHS = [640, 960] as const;
export const HERO_DESKTOP_WIDTHS = [1200, 1600, 1920] as const;
export const HERO_DEFAULT_WIDTH = 960;
export const HERO_DESKTOP_DEFAULT_WIDTH = 1600;
export const PHOTO_WIDTHS = [640, 960, 1120] as const;
export const HERO_LCP_SIZES = "100vw";
export const HERO_LCP_MEDIA_MOBILE = "(max-width: 767px)";
export const HERO_LCP_MEDIA_DESKTOP = "(min-width: 768px)";

function widthSrcSet(assetPath: string, widths: readonly number[], extension: "webp" | "png"): string {
  const basename = responsiveBasename(assetPath);
  return widths.map((width) => `${basePath}${basename}-${width}w.${extension} ${width}w`).join(", ");
}

/** WebP srcSet for responsive hero images generated at build time. */
export function heroWebpSrcSet(heroPath: string, widths: readonly number[] = HERO_WIDTHS): string {
  return widthSrcSet(heroPath, widths, "webp");
}

/** PNG fallback srcSet for responsive hero images. */
export function heroPngSrcSet(heroPath: string): string {
  return widthSrcSet(heroPath, HERO_WIDTHS, "png");
}

/** Default hero `<img src>` — 960w WebP instead of the full-resolution PNG. */
export function heroDefaultWebpUrl(heroPath: string, width: (typeof HERO_WIDTHS)[number] = HERO_DEFAULT_WIDTH): string {
  return `${basePath}${responsiveBasename(heroPath)}-${width}w.webp`;
}

/** WebP srcSet for location / photo images generated at build time. */
export function photoWebpSrcSet(photoPath: string): string {
  return widthSrcSet(photoPath, PHOTO_WIDTHS, "webp");
}