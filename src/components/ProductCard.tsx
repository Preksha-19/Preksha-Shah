import React, { useState } from 'react';
import { ArrowLeftRight, Heart } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';
import { Product } from '../types/catalogue';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigate,
    getBrandById,
    isInWishlist,
    toggleWishlist,
    compareIds,
    toggleCompare,
  } = useCatalogue();

  const brand = getBrandById(product.brandId);
  const wishlisted = isInWishlist(product.id);
  const compared = compareIds.includes(product.id);

  const [hoveredShadeIndex, setHoveredShadeIndex] = useState<number | null>(null);
  const previewShade =
    hoveredShadeIndex !== null ? product.shades[hoveredShadeIndex] : product.shades[0];

  const statusNote = product.isNewArrival
    ? 'New Edition'
    : product.isBestseller
    ? 'House Icon'
    : product.availability === 'Limited'
    ? 'Limited'
    : null;

  return (
    <article className="group flex flex-col bg-[#E6EFFA] border border-[#092147]/10 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#60A5FA]/80">
      {/* 4:5 Portrait Gallery Mat Frame */}
      <div className="relative aspect-[4/5] bg-[#C7DAEE] overflow-hidden m-2 mb-0">
        <button
          type="button"
          onClick={() => navigate({ view: 'product', slug: product.slug })}
          className="w-full h-full block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#071936]"
          aria-label={`View ${brand?.name ?? ''} ${product.name}`}
        >
          <ProductImage
            src={product.mainImage}
            alt={`${brand?.name ?? ''} ${product.name}`}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </button>

        {statusNote && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 text-[10px] tracking-[0.12em] font-medium text-[#071936] bg-[#D7E5F5]/92 px-2.5 py-1 border border-[#092147]/10">
            {statusNote}
          </span>
        )}

        {/* Top-right action icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id, previewShade?.id);
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`w-8 h-8 flex items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#071936] ${
              wishlisted
                ? 'bg-[#071936] border-[#071936] text-[#D7E5F5]'
                : 'bg-[#D7E5F5]/90 border-[#092147]/12 text-[#071936] hover:bg-[#E9F1FB]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            aria-label={compared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
            title={compared ? 'In comparison' : 'Compare product'}
            className={`w-8 h-8 flex items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#071936] ${
              compared
                ? 'bg-[#1D4E9E] border-[#1D4E9E] text-[#E6F0FD]'
                : 'bg-[#D7E5F5]/90 border-[#092147]/12 text-[#092147]/75 hover:bg-[#E9F1FB] hover:text-[#071936]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-[#255391]">
            <button
              type="button"
              onClick={() => brand && navigate({ view: 'brand', slug: brand.slug })}
              className="font-medium text-[#071936]/80 hover:text-[#071936] transition-colors truncate"
            >
              {brand?.name}
            </button>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.subcategory}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate({ view: 'product', slug: product.slug })}
            className="mt-1.5 text-left block w-full focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="font-editorial text-[20px] leading-snug font-medium text-[#071936] group-hover:text-[#1D4E9E] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </button>
        </div>

        <div className="pt-2.5 border-t border-[#092147]/8 flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            {product.shades.length > 0 && (
              <>
                <div className="flex items-center gap-1.5">
                  {product.shades.slice(0, 5).map((shade, idx) => (
                    <button
                      key={shade.id}
                      type="button"
                      onMouseEnter={() => setHoveredShadeIndex(idx)}
                      onMouseLeave={() => setHoveredShadeIndex(null)}
                      onClick={() => navigate({ view: 'product', slug: product.slug })}
                      title={`${shade.name}${!shade.available ? ' (Unavailable)' : ''}`}
                      aria-label={`Preview shade ${shade.name}`}
                      className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                        hoveredShadeIndex === idx
                          ? 'scale-125 border-[#071936]'
                          : 'border-[#092147]/20'
                      } ${!shade.available ? 'opacity-40' : ''}`}
                      style={{ backgroundColor: shade.hex }}
                    />
                  ))}
                  {product.shades.length > 5 && (
                    <span className="text-[11px] text-[#092147]/55 tabular-nums">
                      +{product.shades.length - 5}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#092147]/55 truncate">
                  {hoveredShadeIndex !== null
                    ? previewShade?.name
                    : `${product.shades.length} ${product.shades.length === 1 ? 'shade' : 'shades'} · ${product.finish}`}
                </span>
              </>
            )}
          </div>

          <span className="text-sm font-medium text-[#071936] tabular-nums shrink-0">
            {formatINR(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
};
