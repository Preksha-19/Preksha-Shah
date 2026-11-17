import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  ExternalLink,
  Heart,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';

export const ProductDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const {
    activeProducts,
    getBrandById,
    navigate,
    isInWishlist,
    toggleWishlist,
    compareIds,
    toggleCompare,
    recordProductView,
    recentlyViewedIds,
  } = useCatalogue();

  const product = activeProducts.find((p) => p.slug === slug);
  const brand = product ? getBrandById(product.brandId) : undefined;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedShadeId, setSelectedShadeId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'howto'>('overview');

  useEffect(() => {
    if (product) {
      recordProductView(product.id);
      setSelectedImageIdx(0);
      setZoomed(false);
      const firstAvail = product.shades.find((s) => s.available) ?? product.shades[0];
      setSelectedShadeId(firstAvail?.id);
    }
  }, [product, recordProductView]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return activeProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || p.brandId === product.brandId)
      )
      .slice(0, 4);
  }, [activeProducts, product]);

  const recentlyViewed = useMemo(() => {
    if (!product) return [];
    return recentlyViewedIds
      .filter((id) => id !== product.id)
      .map((id) => activeProducts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .slice(0, 4);
  }, [activeProducts, product, recentlyViewedIds]);

  if (!product) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-16 text-center space-y-4">
        <h1 className="font-editorial text-3xl text-[#092147]">Product Not Found</h1>
        <p className="text-sm text-[#092147]/65">
          This item may have been archived or removed from the active catalogue.
        </p>
        <button
          type="button"
          onClick={() => navigate({ view: 'shop' })}
          className="px-5 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs"
        >
          Return to Catalogue
        </button>
      </main>
    );
  }

  const gallery = product.galleryImages.length > 0 ? product.galleryImages : [product.mainImage];
  const activeImage = gallery[selectedImageIdx] ?? product.mainImage;
  const activeShade =
    product.shades.find((s) => s.id === selectedShadeId) ?? product.shades[0];

  const wishlisted = isInWishlist(product.id);
  const compared = compareIds.includes(product.id);

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#092147]/60 mb-8">
        <button
          type="button"
          onClick={() => navigate({ view: 'shop' })}
          className="inline-flex items-center gap-1.5 hover:text-[#092147] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Catalogue</span>
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => navigate({ view: 'shop', category: product.category })}
          className="hover:text-[#092147] transition-colors"
        >
          {product.category}
        </button>
        {brand && (
          <>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => navigate({ view: 'brand', slug: brand.slug })}
              className="hover:text-[#092147] transition-colors"
            >
              {brand.name}
            </button>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-[#092147] truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Two-Column Product Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="relative aspect-[4/5] bg-[#E9F1FB] border border-[#092147]/10 overflow-hidden">
            <div
              className={`w-full h-full transition-transform duration-300 ease-out cursor-zoom-in ${
                zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
              }`}
              onClick={() => setZoomed((z) => !z)}
            >
              <ProductImage
                src={activeImage}
                alt={`${brand?.name ?? ''} ${product.name}`}
                fallbackTitle={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              className="absolute bottom-4 right-4 p-2.5 bg-[#D7E5F5]/90 border border-[#092147]/15 text-[#092147] hover:bg-[#E9F1FB] transition-colors"
            >
              {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedImageIdx(idx);
                    setZoomed(false);
                  }}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-20 aspect-[4/5] bg-[#E9F1FB] border shrink-0 overflow-hidden transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#092147] ring-1 ring-[#092147]'
                      : 'border-[#092147]/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    fallbackTitle={product.name}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Information & Purchase Discovery Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3 pb-6 border-b border-[#092147]/10">
            <div className="flex items-center justify-between gap-2 text-xs tracking-[0.1em] text-[#092147]/65">
              <button
                type="button"
                onClick={() => brand && navigate({ view: 'brand', slug: brand.slug })}
                className="font-semibold text-[#1D4E9E] hover:text-[#092147] transition-colors"
              >
                {brand?.name}
              </button>
              <span>
                {product.category} · {product.subcategory}
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#092147] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline justify-between gap-4 pt-1">
              <span className="text-2xl font-medium text-[#092147] tabular-nums">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-[#092147]/60">
                {product.size} · {product.availability}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#092147]/80 leading-relaxed">{product.description}</p>

          {/* Shade Selector */}
          {product.shades.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#092147]/60">Selected Shade: </span>
                  <span className="font-semibold text-[#092147]">
                    {activeShade?.code !== activeShade?.name
                      ? `${activeShade?.code} — ${activeShade?.name}`
                      : activeShade?.name}
                  </span>
                </div>
                {activeShade?.undertone && (
                  <span className="text-[#092147]/55">{activeShade.undertone}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {product.shades.map((shade) => {
                  const selected = shade.id === activeShade?.id;
                  return (
                    <button
                      key={shade.id}
                      type="button"
                      onClick={() => setSelectedShadeId(shade.id)}
                      title={`${shade.name}${!shade.available ? ' (Unavailable)' : ''}`}
                      aria-label={`Select shade ${shade.name}`}
                      className={`relative w-9 h-9 rounded-full border transition-transform flex items-center justify-center ${
                        selected
                          ? 'ring-2 ring-[#092147] ring-offset-2 ring-offset-[#D7E5F5] scale-105 border-[#092147]'
                          : 'border-[#092147]/25 hover:scale-105'
                      } ${!shade.available ? 'opacity-45' : ''}`}
                      style={{ backgroundColor: shade.hex }}
                    >
                      {!shade.available && (
                        <span className="w-full h-[1.5px] bg-[#092147] rotate-45 block" />
                      )}
                    </button>
                  );
                })}
              </div>

              {activeShade && !activeShade.available && (
                <p className="text-xs text-[#1D4E9E]">
                  This shade is currently marked unavailable at official retailers.
                </p>
              )}
            </div>
          )}

          {/* Specification Summary Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#E9F1FB] border border-[#092147]/10 p-4 text-xs">
            <div>
              <span className="text-[#092147]/55 block">Finish</span>
              <span className="font-medium text-[#092147]">{product.finish}</span>
            </div>
            <div>
              <span className="text-[#092147]/55 block">Coverage</span>
              <span className="font-medium text-[#092147]">{product.coverage}</span>
            </div>
            <div>
              <span className="text-[#092147]/55 block">Formula</span>
              <span className="font-medium text-[#092147]">{product.formulaType}</span>
            </div>
            <div>
              <span className="text-[#092147]/55 block">Skin Type</span>
              <span className="font-medium text-[#092147]">{product.skinTypes.join(', ')}</span>
            </div>
          </div>

          {/* Primary Purchase / Discovery Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={product.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.1em] font-medium flex items-center justify-center gap-2 hover:bg-[#13366B] transition-colors"
            >
              <span>Visit Official {brand?.name ?? 'Brand'} Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id, activeShade?.id)}
                className={`py-3 px-4 border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                  wishlisted
                    ? 'bg-[#BDD4EE] border-[#092147] text-[#092147]'
                    : 'bg-[#E9F1FB] border-[#092147]/20 text-[#092147] hover:border-[#092147]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                <span>{wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                className={`py-3 px-4 border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                  compared
                    ? 'bg-[#1D4E9E] border-[#1D4E9E] text-[#E6F0FD]'
                    : 'bg-[#E9F1FB] border-[#092147]/20 text-[#092147] hover:border-[#092147]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{compared ? 'In Comparison' : 'Compare'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="pt-4 border-t border-[#092147]/10">
            <div className="flex items-center gap-6 border-b border-[#092147]/10 mb-4">
              {[
                { key: 'overview', label: 'Claims & Details' },
                { key: 'howto', label: 'How to Use' },
                { key: 'ingredients', label: 'Ingredients' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`pb-2.5 text-xs font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-[#092147] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#092147]'
                      : 'text-[#092147]/55 hover:text-[#092147]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <ul className="space-y-2 text-sm text-[#092147]/80">
                {product.claims.map((claim) => (
                  <li key={claim} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1D4E9E] shrink-0 mt-0.5" />
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'howto' && (
              <p className="text-sm text-[#092147]/80 leading-relaxed">{product.howToUse}</p>
            )}

            {activeTab === 'ingredients' && (
              <p className="text-xs text-[#092147]/70 leading-relaxed">{product.ingredients}</p>
            )}
          </div>
        </div>
      </div>

      {/* Similar & Same-Brand Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#092147]/10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.12em] text-[#092147]/55">Pair & Discover</p>
              <h2 className="font-editorial text-3xl font-semibold text-[#092147] mt-1">
                Similar & Complementary Icons
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#092147]/10">
          <h2 className="font-editorial text-2xl font-semibold text-[#092147] mb-6">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
