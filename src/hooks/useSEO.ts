import { useEffect, useMemo } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_TITLE = 'Saffron & Spice';
const DEFAULT_DESCRIPTION =
  'An upscale Indian dining showcase with signature dishes, immersive storytelling, and a polished ordering and reservation flow.';
const DEFAULT_KEYWORDS = [
  'Indian fine dining',
  'restaurant portfolio website',
  'React restaurant site',
  'Saffron and Spice',
  'Silchar restaurant',
];
const DEFAULT_IMAGE = '/og-image.svg';

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);

  if (!meta) {
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }

  Object.entries(attributes).forEach(([key, value]) => meta!.setAttribute(key, value));
}

function ensureLink(selector: string, attributes: Record<string, string>) {
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement('link');
    document.head.appendChild(link);
  }

  Object.entries(attributes).forEach(([key, value]) => link!.setAttribute(key, value));
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  structuredData,
}: SEOProps) {
  const data = useMemo(
    () => (Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    [structuredData],
  );

  useEffect(() => {
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const pathname = path || window.location.pathname;
    const canonicalUrl = new URL(pathname, origin).toString();
    const imageUrl = new URL(image, origin).toString();
    const pageTitle = title === BASE_TITLE ? BASE_TITLE : `${title} | ${BASE_TITLE}`;

    document.title = pageTitle;

    ensureMeta('meta[name="description"]', { name: 'description', content: description });
    ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
    ensureMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    });
    ensureMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#0b0b0b' });

    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: BASE_TITLE });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' });

    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

    ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    document
      .querySelectorAll('script[data-seo-ld]')
      .forEach(script => script.parentElement?.removeChild(script));

    data.forEach(item => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', 'true');
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });

    return () => {
      document
        .querySelectorAll('script[data-seo-ld]')
        .forEach(script => script.parentElement?.removeChild(script));
    };
  }, [data, description, image, keywords, noIndex, path, title, type]);
}
