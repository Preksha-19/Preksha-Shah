import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductBounceShowcase } from '../components/ProductBounceShowcase';
import { ProductImage } from '../components/ProductImage';
import { useCatalogue } from '../context/CatalogueContext';
import { IMAGES } from '../data/catalogueSeed';
import { ProductCategory } from '../types/catalogue';

const CATEGORY_CARDS: {
  index: string;
  category: ProductCategory;
  description: string;
  image: string;
}[] = [
  {
    index: '01',
    category: 'Face',
    description: 'Foundations, micro-droplet skin tints, primers & finishing powders',
    image: IMAGES.foundation,
  },
  {
    index: '02',
    category: 'Eyes',
    description: 'Four-pan couture quads, warm bronze palettes & defining mascaras',
    image: IMAGES.eyeshadow,
  },
  {
    index: '03',
    category: 'Lips',
    description: 'Velvet mattes, cherry-oil glosses, lip kits & couture satin reds',
    image: IMAGES.lipstick,
  },
  {
    index: '04',
    category: 'Cheeks',
    description: 'Colour-awakening blushes, light wands, glow balms & bronzers',
    image: IMAGES.blush,
  },
];

export const HomeView: React.FC = () => {
  const {
    homepageConfig,
    activeBrands,
    activeProducts,
    publishedCollections,
    navigate,
  } = useCatalogue();

  const [showcaseTab, setShowcaseTab] = useState<'all' | 'bestsellers' | 'new'>('all');

  const showcasedProducts = useMemo(() => {
    if (showcaseTab === 'bestsellers') {
      return activeProducts.filter((p) => p.isBestseller);
    }
    if (showcaseTab === 'new') {
      const news = activeProducts.filter((p) => p.isNewArrival);
      return news.length > 0 ? news : activeProducts;
    }
    return activeProducts;
  }, [activeProducts, showcaseTab]);

  return (
    <main>
      {/* 1. Editorial Hero Campaign */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pt-8 sm:pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#E6EFFA] border border-[#092147]/12 items-stretch">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-[#60A5FA]" aria-hidden="true" />
                <p className="text-[11px] tracking-[0.2em] text-[#255391] font-medium">
                  Haute Beauty Index · India
                </p>
              </div>
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[64px] leading-[1.02] font-normal text-[#071936] text-balance">
                {homepageConfig.heroTitle}
              </h1>
              <p className="text-sm sm:text-[15px] text-[#092147]/70 leading-[1.7] max-w-md">
                {homepageConfig.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-[#092147]/10">
              <button
                type="button"
                onClick={() => navigate({ view: 'shop' })}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#071936] text-[#D7E5F5] text-xs tracking-[0.14em] font-medium hover:bg-[#13366B] transition-colors"
              >
                <span>{homepageConfig.heroCtaText}</span>
                <ArrowRight className="w-4 h-4 text-[#60A5FA]" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ view: 'brands' })}
                className="py-2 text-xs tracking-[0.12em] font-medium text-[#071936] hover:text-[#1D4E9E] border-b border-[#092147]/30 hover:border-[#1D4E9E] transition-colors"
              >
                Seven Houses
              </button>
            </div>
          </div>

          {/* Right Hero Photography */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[440px] lg:min-h-[560px] bg-[#BDD4EE] border-t lg:border-t-0 lg:border-l border-[#092147]/10">
            <ProductImage
              src={homepageConfig.heroImage}
              alt="Luxury makeup editorial still life"
              fallbackTitle="MAISON ÉDIT"
              className="w-full h-full lg:absolute lg:inset-0 object-cover"
            />
          </div>
        </div>

        {/* Minimalist Seven Houses Index Strip */}
        <div className="mt-10 border-y border-[#092147]/12 py-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-8 gap-y-4">
            {activeBrands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => navigate({ view: 'brand', slug: brand.slug })}
                className="font-editorial text-lg sm:text-[21px] tracking-[0.16em] font-normal text-[#092147]/70 hover:text-[#071936] transition-colors whitespace-nowrap"
              >
                {brand.wordmark}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Shop by Category (4 Editorial Cards) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-14 sm:py-20">
        <div className="flex items-end justify-between gap-4 pb-6 mb-10 border-b border-[#092147]/10">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#255391] font-medium">
              Curated Taxonomy
            </p>
            <h2 className="font-editorial text-3xl sm:text-[42px] font-normal text-[#071936] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate({ view: 'shop' })}
            className="text-xs tracking-[0.12em] font-medium text-[#071936] hover:text-[#1D4E9E] transition-colors inline-flex items-center gap-2 pb-1 border-b border-[#092147]/25"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {CATEGORY_CARDS.map((card) => (
            <button
              key={card.category}
              type="button"
              onClick={() => navigate({ view: 'shop', category: card.category })}
              className="group text-left bg-[#E6EFFA] border border-[#092147]/10 hover:border-[#60A5FA] transition-all flex flex-col p-2.5"
            >
              <div className="aspect-[4/5] w-full bg-[#C7DAEE] overflow-hidden">
                <ProductImage
                  src={card.image}
                  alt={`${card.category} makeup`}
                  fallbackTitle={card.category}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-2.5 pt-4 pb-2 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-editorial text-2xl sm:text-[26px] font-medium text-[#071936]">
                      {card.category}
                    </h3>
                    <span className="text-[11px] text-[#60A5FA] tabular-nums">{card.index}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#092147]/65 leading-relaxed line-clamp-2">
                    {card.description}
                  </p>
                </div>
                <span className="pt-2 border-t border-[#092147]/8 inline-flex items-center justify-between text-[11px] tracking-[0.1em] font-medium text-[#071936] group-hover:text-[#1D4E9E] transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. All Iconic Products in Interactive Bounce Cards Fans */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-14 sm:py-20 border-t border-[#092147]/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#255391] font-medium">
              Interactive House Archive · INR (₹)
            </p>
            <h2 className="font-editorial text-3xl sm:text-[42px] font-normal text-[#071936] mt-1">
              Signature House Icons
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#BDD4EE]/70 border border-[#092147]/8 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowcaseTab('all')}
              className={`px-4 py-2 text-xs tracking-[0.04em] font-medium transition-colors whitespace-nowrap ${
                showcaseTab === 'all'
                  ? 'bg-[#071936] text-[#D7E5F5]'
                  : 'text-[#092147]/70 hover:text-[#071936]'
              }`}
            >
              All 7 Houses ({activeProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setShowcaseTab('bestsellers')}
              className={`px-4 py-2 text-xs tracking-[0.04em] font-medium transition-colors whitespace-nowrap ${
                showcaseTab === 'bestsellers'
                  ? 'bg-[#071936] text-[#D7E5F5]'
                  : 'text-[#092147]/70 hover:text-[#071936]'
              }`}
            >
              Bestsellers
            </button>
            <button
              type="button"
              onClick={() => setShowcaseTab('new')}
              className={`px-4 py-2 text-xs tracking-[0.04em] font-medium transition-colors whitespace-nowrap ${
                showcaseTab === 'new'
                  ? 'bg-[#071936] text-[#D7E5F5]'
                  : 'text-[#092147]/70 hover:text-[#071936]'
              }`}
            >
              New Editions
            </button>
          </div>
        </div>

        <ProductBounceShowcase
          products={showcasedProducts}
          groupByBrand={showcaseTab === 'all'}
        />

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate({ view: 'shop' })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#071936] text-[#D7E5F5] text-xs tracking-[0.14em] font-medium hover:bg-[#13366B] transition-colors"
          >
            <span>Open Complete Filterable Index ({activeProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#60A5FA]" />
          </button>
        </div>
      </section>

      {/* 4. Dark Luxury Editorial Showcase & Curated Collections */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-14 sm:py-20">
        <div className="bg-[#051229] text-[#D7E5F5] grid grid-cols-1 lg:grid-cols-12 items-stretch border border-[#60A5FA]/25">
          <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[420px]">
            <ProductImage
              src={homepageConfig.editorialImage}
              alt="Dark luxury evening beauty editorial"
              fallbackTitle="Evening Glamour"
              className="w-full h-full lg:absolute lg:inset-0 object-cover"
            />
          </div>

          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-[1px] bg-[#60A5FA]" aria-hidden="true" />
                <p className="text-[11px] tracking-[0.2em] text-[#60A5FA] font-medium">
                  Editorial Editions
                </p>
              </div>
              <h2 className="font-editorial text-3xl sm:text-[42px] font-normal leading-[1.1] text-balance">
                {homepageConfig.editorialTitle}
              </h2>
              <p className="text-sm text-[#BDD4EE]/75 leading-[1.7]">
                {homepageConfig.editorialSubtitle}
              </p>
            </div>

            <div className="space-y-1 border-t border-[#60A5FA]/20 pt-5">
              {publishedCollections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => navigate({ view: 'collection', slug: col.slug })}
                  className="w-full flex items-center justify-between py-3 text-left border-b border-[#60A5FA]/10 group"
                >
                  <div>
                    <span className="font-editorial text-xl text-[#D7E5F5] group-hover:text-[#60A5FA] transition-colors">
                      {col.title}
                    </span>
                    <span className="text-xs text-[#BDD4EE]/50 ml-3">{col.subtitle}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#60A5FA] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
