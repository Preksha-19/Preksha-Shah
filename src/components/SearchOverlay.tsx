import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';
import { ProductImage } from './ProductImage';

const SUGGESTED_QUERIES = [
  'Nude Lipstick',
  'Dior Foundation',
  'Pink Blush',
  'Matte Lipstick',
  'Fenty Gloss',
  'Lip Oil',
];

export const SearchOverlay: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    activeProducts,
    activeBrands,
    recentSearches,
    addRecentSearch,
    navigate,
    getBrandById,
  } = useCatalogue();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const normalized = query.trim().toLowerCase();

  const matchingBrands = useMemo(() => {
    if (!normalized) return [];
    return activeBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(normalized) ||
        b.origin.toLowerCase().includes(normalized)
    );
  }, [activeBrands, normalized]);

  const matchingProducts = useMemo(() => {
    if (!normalized) return [];
    const tokens = normalized.split(/\s+/).filter(Boolean);
    return activeProducts.filter((product) => {
      const brand = getBrandById(product.brandId);
      const searchable = [
        product.name,
        brand?.name ?? '',
        product.category,
        product.subcategory,
        product.finish,
        product.formulaType,
        ...product.shades.map((s) => `${s.name} ${s.code} ${s.colourFamily} ${s.undertone ?? ''}`),
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => searchable.includes(token));
    });
  }, [activeProducts, getBrandById, normalized]);

  if (!searchOpen) return null;

  const handleSelectProduct = (slug: string) => {
    if (query.trim()) addRecentSearch(query.trim());
    navigate({ view: 'product', slug });
  };

  const handleSelectBrand = (slug: string) => {
    if (query.trim()) addRecentSearch(query.trim());
    navigate({ view: 'brand', slug });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#D7E5F5]/98 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Search makeup catalogue"
    >
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#092147]/15">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#092147]/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, shades, or finishes (e.g., Nude Lipstick, Dior)..."
              aria-label="Search query"
              className="w-full bg-transparent font-editorial text-2xl sm:text-3xl text-[#092147] placeholder:text-[#092147]/35 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-3 py-1.5 text-xs text-[#092147]/70 hover:text-[#092147] transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="p-2 text-[#092147] hover:bg-[#BDD4EE]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Empty / Initial Suggestions */}
        {!normalized && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/60 mb-3">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 text-xs bg-[#E9F1FB] border border-[#092147]/12 text-[#092147] hover:border-[#092147] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/60 mb-3">
                  Suggested Queries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-xs bg-[#BDD4EE]/50 text-[#092147] hover:bg-[#BDD4EE] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <h3 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/60 mb-4">
                Explore by Luxury House
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeBrands.map((brand) => (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleSelectBrand(brand.slug)}
                    className="p-4 text-left bg-[#E9F1FB] border border-[#092147]/10 hover:border-[#092147] transition-colors group"
                  >
                    <span className="font-editorial text-lg font-semibold text-[#092147] block">
                      {brand.name}
                    </span>
                    <span className="text-[11px] text-[#092147]/55 flex items-center gap-1 mt-1 group-hover:text-[#1D4E9E]">
                      <span>View House</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Search Results */}
        {normalized && (
          <div className="mt-8 space-y-8">
            {matchingBrands.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/60 mb-3">
                  Matching Houses
                </h3>
                <div className="flex flex-wrap gap-3">
                  {matchingBrands.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleSelectBrand(brand.slug)}
                      className="px-4 py-2 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.08em] hover:bg-[#13366B] transition-colors flex items-center gap-2"
                    >
                      <span>{brand.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs tracking-[0.08em] font-semibold text-[#092147]/60">
                  Products ({matchingProducts.length})
                </h3>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="py-16 text-center bg-[#E9F1FB] border border-[#092147]/10 p-8">
                  <p className="font-editorial text-2xl text-[#092147]">
                    No products matched “{query}”
                  </p>
                  <p className="mt-2 text-sm text-[#092147]/65 max-w-md mx-auto">
                    Try searching by a brand name such as CHANEL or Dior, a product type like Skin
                    Tint or Blush, or a shade like Pillow Talk.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {SUGGESTED_QUERIES.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 text-xs border border-[#092147]/20 hover:border-[#092147] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingProducts.slice(0, 12).map((product) => {
                    const brand = getBrandById(product.brandId);
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-4 p-3 bg-[#E9F1FB] border border-[#092147]/10 hover:border-[#092147] transition-colors text-left"
                      >
                        <div className="w-16 h-20 bg-[#C7DAEE] shrink-0 overflow-hidden">
                          <ProductImage
                            src={product.mainImage}
                            alt={product.name}
                            fallbackTitle={product.name}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] tracking-[0.06em] text-[#092147]/60 truncate">
                            {brand?.name} · {product.subcategory}
                          </p>
                          <p className="font-editorial text-lg font-semibold text-[#092147] truncate">
                            {product.name}
                          </p>
                          <p className="text-xs font-medium text-[#092147]/80 tabular-nums mt-1">
                            {formatINR(product.price)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
