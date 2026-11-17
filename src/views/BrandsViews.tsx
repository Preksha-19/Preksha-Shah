import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Layers, LayoutGrid } from 'lucide-react';
import { ProductBounceShowcase } from '../components/ProductBounceShowcase';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useCatalogue } from '../context/CatalogueContext';
import { ProductCategory } from '../types/catalogue';

export const BrandsDirectoryView: React.FC = () => {
  const { activeBrands, activeProducts, navigate } = useCatalogue();

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-10 sm:py-14">
      <div className="pb-8 border-b border-[#092147]/10 space-y-2">
        <p className="text-xs tracking-[0.12em] text-[#092147]/55">Maison Directory</p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#092147]">
          Seven Defining Beauty Houses
        </h1>
        <p className="text-sm text-[#092147]/70 max-w-2xl">
          Select a house to explore its heritage, iconic product formulations, and full verified
          shade catalogue.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBrands.map((brand) => {
          const count = activeProducts.filter((p) => p.brandId === brand.id).length;
          return (
            <article
              key={brand.id}
              className="bg-[#E9F1FB] border border-[#092147]/10 flex flex-col justify-between group hover:border-[#092147]/35 transition-colors"
            >
              <div>
                <div className="aspect-[16/10] bg-[#C7DAEE] overflow-hidden">
                  <ProductImage
                    src={brand.bannerImage}
                    alt={brand.name}
                    fallbackTitle={brand.wordmark}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] tracking-[0.06em] text-[#092147]/55">
                    <span>{brand.origin}</span>
                    <span className="tabular-nums">{count} Iconic Products</span>
                  </div>
                  <h2 className="font-editorial text-3xl font-semibold tracking-[0.06em] text-[#092147]">
                    {brand.wordmark}
                  </h2>
                  <p className="text-sm text-[#092147]/75 leading-relaxed">{brand.tagline}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-[#092147]/8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate({ view: 'brand', slug: brand.slug })}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.06em] text-[#092147] group-hover:text-[#1D4E9E] transition-colors"
                >
                  <span>Enter House</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={brand.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#092147]/55 hover:text-[#092147] inline-flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export const BrandDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { activeBrands, activeProducts, navigate } = useCatalogue();
  const brand = activeBrands.find((b) => b.slug === slug);

  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [viewMode, setViewMode] = useState<'bounce' | 'grid'>('bounce');

  const brandProducts = useMemo(() => {
    if (!brand) return [];
    const list = activeProducts.filter((p) => p.brandId === brand.id);
    if (selectedCategory === 'All') return list;
    return list.filter((p) => p.category === selectedCategory);
  }, [activeProducts, brand, selectedCategory]);

  if (!brand) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-16 text-center space-y-4">
        <h1 className="font-editorial text-3xl">House Not Found</h1>
        <button
          type="button"
          onClick={() => navigate({ view: 'brands' })}
          className="px-5 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs"
        >
          Back to Brand Directory
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate({ view: 'brands' })}
        className="inline-flex items-center gap-2 text-xs text-[#092147]/65 hover:text-[#092147] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Brands</span>
      </button>

      {/* Brand Hero Banner */}
      <div className="bg-[#E9F1FB] border border-[#092147]/10 grid grid-cols-1 lg:grid-cols-12 items-stretch mb-12">
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.12em] text-[#1D4E9E] font-medium">
              {brand.origin}
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl font-semibold tracking-[0.08em] text-[#092147]">
              {brand.wordmark}
            </h1>
            <p className="text-base font-medium text-[#092147]/85">{brand.tagline}</p>
            <p className="text-sm text-[#092147]/70 leading-relaxed">{brand.description}</p>
          </div>

          <div className="pt-4 border-t border-[#092147]/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#092147]/60">{brand.inspirationNote}</span>
            <a
              href={brand.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.06em] hover:bg-[#13366B] transition-colors"
            >
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-[#C7DAEE]">
          <ProductImage
            src={brand.bannerImage}
            alt={brand.name}
            fallbackTitle={brand.wordmark}
            className="w-full h-full lg:absolute lg:inset-0 object-cover"
          />
        </div>
      </div>

      {/* Category Filter Bar + Layout Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#092147]/10">
        <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/60">
          {(['All', ...brand.categories] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#E9F1FB] text-[#092147]'
                  : 'text-[#092147]/65 hover:text-[#092147]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/60">
            <button
              type="button"
              onClick={() => setViewMode('bounce')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'bounce'
                  ? 'bg-[#E9F1FB] text-[#092147]'
                  : 'text-[#092147]/65 hover:text-[#092147]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bounce Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'grid'
                  ? 'bg-[#E9F1FB] text-[#092147]'
                  : 'text-[#092147]/65 hover:text-[#092147]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
          <span className="text-xs text-[#092147]/60 tabular-nums">
            {brandProducts.length} {brandProducts.length === 1 ? 'product' : 'products'} in index
          </span>
        </div>
      </div>

      {/* Brand Products */}
      {brandProducts.length === 0 ? (
        <div className="bg-[#E9F1FB] border border-[#092147]/10 p-12 text-center space-y-3">
          <p className="font-editorial text-2xl text-[#092147]">
            No products listed in this category yet
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 bg-[#092147] text-[#D7E5F5] text-xs"
          >
            View All {brand.name} Products
          </button>
        </div>
      ) : viewMode === 'bounce' ? (
        <ProductBounceShowcase products={brandProducts} groupByBrand={false} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};
