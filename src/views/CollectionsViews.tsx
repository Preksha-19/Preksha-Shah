import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductBounceShowcase } from '../components/ProductBounceShowcase';
import { ProductImage } from '../components/ProductImage';
import { useCatalogue } from '../context/CatalogueContext';

export const CollectionsView: React.FC = () => {
  const { publishedCollections, navigate } = useCatalogue();

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-10 sm:py-14">
      <div className="pb-8 border-b border-[#092147]/10 space-y-2">
        <p className="text-xs tracking-[0.12em] text-[#092147]/55">Editorial Curations</p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#092147]">
          Curated Beauty Collections
        </h1>
        <p className="text-sm text-[#092147]/70 max-w-2xl">
          Thematic beauty edits pairing iconic shades and textures across our seven partner
          houses.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {publishedCollections.map((collection) => (
          <article
            key={collection.id}
            className={`border flex flex-col justify-between group ${
              collection.theme === 'dark'
                ? 'bg-[#071936] text-[#D7E5F5] border-[#092147]'
                : 'bg-[#E9F1FB] text-[#092147] border-[#092147]/10'
            }`}
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-[#BDD4EE]">
                <ProductImage
                  src={collection.bannerImage}
                  alt={collection.title}
                  fallbackTitle={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-8 space-y-3">
                <p
                  className={`text-xs tracking-[0.12em] ${
                    collection.theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#1D4E9E]'
                  }`}
                >
                  {collection.subtitle}
                </p>
                <h2 className="font-editorial text-3xl font-semibold">{collection.title}</h2>
                <p
                  className={`text-sm leading-relaxed ${
                    collection.theme === 'dark' ? 'text-[#BDD4EE]/75' : 'text-[#092147]/70'
                  }`}
                >
                  {collection.description}
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 flex items-center justify-between">
              <span
                className={`text-xs tabular-nums ${
                  collection.theme === 'dark' ? 'text-[#BDD4EE]/60' : 'text-[#092147]/55'
                }`}
              >
                {collection.productIds.length} Curated Icons
              </span>
              <button
                type="button"
                onClick={() => navigate({ view: 'collection', slug: collection.slug })}
                className={`inline-flex items-center gap-2 text-xs tracking-[0.08em] font-medium ${
                  collection.theme === 'dark'
                    ? 'text-[#60A5FA] hover:text-[#E6F0FD]'
                    : 'text-[#092147] hover:text-[#1D4E9E]'
                } transition-colors`}
              >
                <span>Explore Edit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export const CollectionDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { publishedCollections, activeProducts, navigate } = useCatalogue();
  const collection = publishedCollections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-16 text-center space-y-4">
        <h1 className="font-editorial text-3xl">Collection Not Found</h1>
        <button
          type="button"
          onClick={() => navigate({ view: 'collections' })}
          className="px-5 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs"
        >
          Back to Collections
        </button>
      </main>
    );
  }

  const products = collection.productIds
    .map((id) => activeProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate({ view: 'collections' })}
        className="inline-flex items-center gap-2 text-xs text-[#092147]/65 hover:text-[#092147] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Collections</span>
      </button>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 items-stretch mb-12 border ${
          collection.theme === 'dark'
            ? 'bg-[#071936] text-[#D7E5F5] border-[#092147]'
            : 'bg-[#E9F1FB] text-[#092147] border-[#092147]/10'
        }`}
      >
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center space-y-4">
          <p
            className={`text-xs tracking-[0.12em] ${
              collection.theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#1D4E9E]'
            }`}
          >
            {collection.subtitle}
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold">
            {collection.title}
          </h1>
          <p
            className={`text-sm leading-relaxed ${
              collection.theme === 'dark' ? 'text-[#BDD4EE]/75' : 'text-[#092147]/70'
            }`}
          >
            {collection.description}
          </p>
        </div>
        <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px]">
          <ProductImage
            src={collection.bannerImage}
            alt={collection.title}
            fallbackTitle={collection.title}
            className="w-full h-full lg:absolute lg:inset-0 object-cover"
          />
        </div>
      </div>

      <ProductBounceShowcase products={products} groupByBrand={false} />
    </main>
  );
};
