import { vlpPageUrl } from "@/lib/site";
import { pageRoute } from "@/lib/page-route";
import type { VlpPageConfig } from "@/lib/vlp-schema";

const PLACEHOLDER_HOSTS = new Set(["example.com", "www.example.com"]);

function isPlaceholderUrl(url: string) {
  try {
    return PLACEHOLDER_HOSTS.has(new URL(url).hostname);
  } catch {
    return true;
  }
}

function resolveOgImages(config: VlpPageConfig) {
  const configured =
    config.site.seo.openGraph?.images?.filter((image) => !isPlaceholderUrl(image.url)) ?? [];

  if (configured.length > 0) {
    return configured.map((image) => ({
      url: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt,
    }));
  }

  const heroSrc = config.site.assets.heroImageSrc;
  if (!heroSrc) return [];

  return [
    {
      url: heroSrc.startsWith("http") ? heroSrc : vlpPageUrl(heroSrc),
      width: 1200,
      height: 630,
      alt: config.hero?.heroImageAlt ?? config.site.hospitalName,
    },
  ];
}

export function vlpMetadata(config: VlpPageConfig) {
  const { site } = config;
  const canonical = vlpPageUrl(pageRoute({ slug: site.slug, route: site.route }));
  const og = site.seo.openGraph;
  const images = resolveOgImages(config);

  return {
    title: site.seo.title,
    description: site.seo.description,
    ...(site.seo.keywords?.length ? { keywords: site.seo.keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: og?.title ?? site.seo.title,
      description: og?.description ?? site.seo.description,
      url: canonical,
      siteName: og?.siteName ?? site.brandName,
      locale: og?.locale ?? "en_IN",
      ...(images.length ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: og?.title ?? site.seo.title,
      description: og?.description ?? site.seo.description,
      ...(images.length ? { images: images.map((image) => image.url) } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function vlpThankYouMetadata(config: VlpPageConfig) {
  return {
    title: `Thank You | ${config.site.hospitalShortName}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export function vlpJsonLd(config: VlpPageConfig, pageUrl: string) {
  const { site } = config;
  const heroSrc = site.assets.heroImageSrc;

  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: site.hospitalName,
    description: site.seo.description,
    url: pageUrl,
    telephone: site.phone.tel,
    ...(heroSrc ? { image: heroSrc.startsWith("http") ? heroSrc : vlpPageUrl(heroSrc) } : {}),
    address: {
      "@type": "PostalAddress",
      name: site.address,
    },
    parentOrganization: {
      "@type": "Organization",
      name: site.chainName,
    },
  };
}