import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, ArrowRight, Heart } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';
import { Product } from '../types/catalogue';
import BounceCards, { BounceCardItem } from './BounceCards';

interface BounceRowProps {
  indexLabel?: string;
  title?: string;
  subtitle?: string;
  products: Product[];
  onExploreTitle?: () => void;
}

const BounceProductRow: React.FC<BounceRowProps> = ({
  indexLabel,
  title,
  subtitle,
  products,
  onExploreTitle,
}) => {
  const {
    getBrandById,
    navigate,
    isInWishlist,
    toggleWishlist,
    compareIds,
    toggleCompare,
  } = useCatalogue();
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(960);
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setMeasuredWidth(el.clientWidth || 960);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = Math.max(1, products.length);
  const isMobile = measuredWidth < 640;
  const isTablet = measuredWidth >= 640 && measuredWidth < 1024;

  const cardSize = isMobile ? 120 : isTablet ? 164 : 196;
  const maxUsableWidth = Math.max(280, measuredWidth - 32);
  const idealSpread = count > 1 ? Math.min(138, (maxUsableWidth - cardSize) / (count - 1)) : 0;
  const spread = Math.max(isMobile ? 42 : 70, idealSpread);
  const pushDistance = isMobile ? 46 : isTablet ? 88 : 116;
  const containerHeight = isMobile ? 235 : isTablet ? 290 : 345;

  const cards: BounceCardItem[] = useMemo(
    () =>
      products.map((p) => {
        const brand = getBrandById(p.brandId);
        return {
          src: p.mainImage,
          alt: `${brand?.name ?? ''} ${p.name}`,
          brand: brand?.name,
          title: p.name,
          price: formatINR(p.price),
        };
      }),
    [getBrandById, products]
  );

  // Default gracefully to first/center signature item when not hovering
  const spotlightIdx = hoveredIdx >= 0 && products[hoveredIdx] ? hoveredIdx : 0;
  const spotlightProduct = products[spotlightIdx];
  const spotlightBrand = spotlightProduct ? getBrandById(spotlightProduct.brandId) : null;
  const isHovered = hoveredIdx >= 0 && Boolean(products[hoveredIdx]);

  return (
    <section
      ref={containerRef}
      className="bg-[#E6EFFA] border border-[#092147]/10 px-5 sm:px-10 py-8 sm:py-10 space-y-6 overflow-hidden"
    >
      {(title || subtitle) && (
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#092147]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-[11px] tracking-[0.14em] text-[#255391] font-medium">
              {indexLabel && <span className="tabular-nums text-[#60A5FA]">{indexLabel}</span>}
              {indexLabel && subtitle && <span aria-hidden="true">·</span>}
              {subtitle && <span>{subtitle}</span>}
            </div>
            {title && (
              <h3 className="font-editorial text-3xl sm:text-[34px] font-medium tracking-[0.06em] text-[#071936]">
                {title}
              </h3>
            )}
          </div>
          {onExploreTitle && (
            <button
              type="button"
              onClick={onExploreTitle}
              className="inline-flex items-center gap-2 text-xs tracking-[0.1em] font-medium text-[#071936] hover:text-[#1D4E9E] transition-colors pb-1 border-b border-[#092147]/25 hover:border-[#1D4E9E]"
            >
              <span>Explore Maison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Centered Luxury Gallery BounceCards Fan */}
      <div className="flex justify-center py-2">
        <BounceCards
          images={cards}
          containerWidth={maxUsableWidth}
          containerHeight={containerHeight}
          cardSize={cardSize}
          spread={spread}
          rotation={6}
          arc={12}
          pushDistance={pushDistance}
          hoverScale={1.08}
          bounciness={0.5}
          animationDelay={0.1}
          animationStagger={0.05}
          borderWidth={1}
          borderColor="rgba(9, 33, 71, 0.16)"
          radius={4}
          shadow
          enableHover
          showCaptions
          onCardHover={(idx) => setHoveredIdx(idx)}
          onCardClick={(idx) => {
            const target = products[idx];
            if (target) navigate({ view: 'product', slug: target.slug });
          }}
        />
      </div>

      {/* Curated Spotlight Bar */}
      {spotlightProduct && (
        <div className="pt-4 border-t border-[#092147]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
            <span className="text-[11px] tracking-[0.12em] font-medium text-[#255391] shrink-0">
              {isHovered ? 'Selected' : 'Featured'} · {spotlightBrand?.name}
            </span>
            <button
              type="button"
              onClick={() => navigate({ view: 'product', slug: spotlightProduct.slug })}
              className="font-editorial text-xl font-medium text-[#071936] hover:text-[#1D4E9E] transition-colors text-left truncate"
            >
              {spotlightProduct.name}
            </button>
            <span className="text-xs text-[#092147]/55 shrink-0">
              {spotlightProduct.subcategory} · {spotlightProduct.finish}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Shade Swatches */}
            {spotlightProduct.shades.length > 0 && (
              <div className="flex items-center gap-1.5" aria-label="Available shades">
                {spotlightProduct.shades.slice(0, 5).map((shade) => (
                  <span
                    key={shade.id}
                    title={shade.name}
                    className="w-3 h-3 rounded-full border border-[#092147]/20"
                    style={{ backgroundColor: shade.hex }}
                  />
                ))}
                {spotlightProduct.shades.length > 5 && (
                  <span className="text-[11px] text-[#092147]/55 tabular-nums">
                    +{spotlightProduct.shades.length - 5}
                  </span>
                )}
              </div>
            )}

            <span className="text-sm font-medium tabular-nums text-[#071936]">
              {formatINR(spotlightProduct.price)}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleWishlist(spotlightProduct.id)}
                aria-label={`Save ${spotlightProduct.name} to wishlist`}
                className={`p-2 border transition-colors ${
                  isInWishlist(spotlightProduct.id)
                    ? 'bg-[#071936] border-[#071936] text-[#D7E5F5]'
                    : 'bg-[#E9F1FB] border-[#092147]/15 text-[#092147] hover:border-[#092147]'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isInWishlist(spotlightProduct.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(spotlightProduct.id)}
                aria-label={`Compare ${spotlightProduct.name}`}
                className={`p-2 border transition-colors ${
                  compareIds.includes(spotlightProduct.id)
                    ? 'bg-[#1D4E9E] border-[#1D4E9E] text-[#E6F0FD]'
                    : 'bg-[#E9F1FB] border-[#092147]/15 text-[#092147] hover:border-[#092147]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ view: 'product', slug: spotlightProduct.slug })}
                className="px-4 py-2 bg-[#071936] text-[#D7E5F5] text-xs tracking-[0.08em] font-medium hover:bg-[#13366B] transition-colors"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface ProductBounceShowcaseProps {
  products: Product[];
  groupByBrand?: boolean;
}

export const ProductBounceShowcase: React.FC<ProductBounceShowcaseProps> = ({
  products,
  groupByBrand = true,
}) => {
  const { activeBrands, navigate } = useCatalogue();

  if (products.length === 0) return null;

  if (groupByBrand) {
    const groups = activeBrands
      .map((brand) => ({
        brand,
        items: products.filter((p) => p.brandId === brand.id),
      }))
      .filter((g) => g.items.length > 0);

    return (
      <div className="space-y-10">
        {groups.map(({ brand, items }, idx) => (
          <BounceProductRow
            key={brand.id}
            indexLabel={String(idx + 1).padStart(2, '0')}
            title={brand.wordmark}
            subtitle={`${brand.origin} · ${items.length} Signature Formulations`}
            products={items}
            onExploreTitle={() => navigate({ view: 'brand', slug: brand.slug })}
          />
        ))}
      </div>
    );
  }

  const chunkSize = 5;
  const chunks: Product[][] = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    chunks.push(products.slice(i, i + chunkSize));
  }

  return (
    <div className="space-y-10">
      {chunks.map((chunk, idx) => (
        <BounceProductRow
          key={`fan-${idx}-${chunk.map((c) => c.id).join('-')}`}
          products={chunk}
        />
      ))}
    </div>
  );
};
