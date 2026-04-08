import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

const BASE = 'Saffron & Spice';

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | ${BASE}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);
}
