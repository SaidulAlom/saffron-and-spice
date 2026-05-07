import React, { useState, useEffect } from 'react';

const FALLBACK =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

interface ImageWithFallbackProps extends React.ComponentPropsWithoutRef<'img'> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = FALLBACK,
  className,
  loading = 'lazy',   // ← lazy-load by default; caller can pass "eager" for above-the-fold
  decoding = 'async', // ← don't block the main thread for image decode
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored) {
      setImgSrc(fallbackSrc);
      setErrored(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  );
};
