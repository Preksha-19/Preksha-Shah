import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
}) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-[#D7E5F5] via-[#BDD4EE] to-[#9FC0E6] flex flex-col items-center justify-center p-6 text-center select-none"
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-5 h-5 text-[#3E70B3] mb-2 stroke-[1.25]" />
        <span className="font-editorial text-base text-[#092147]/80 leading-snug max-w-[16ch]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
      loading="lazy"
    />
  );
};
