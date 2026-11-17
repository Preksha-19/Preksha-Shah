import React from 'react';
import { Heart, Trash2, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';
import { ProductImage } from './ProductImage';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlistOpen,
    setWishlistOpen,
    wishlist,
    activeProducts,
    getBrandById,
    toggleWishlist,
    navigate,
  } = useCatalogue();

  if (!wishlistOpen) return null;

  const items = wishlist
    .map((entry) => {
      const product = activeProducts.find((p) => p.id === entry.productId);
      if (!product) return null;
      const shade = entry.shadeId
        ? product.shades.find((s) => s.id === entry.shadeId)
        : product.shades[0];
      return { entry, product, shade };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Saved Wishlist">
      <div
        className="fixed inset-0 bg-[#092147]/40 backdrop-blur-[2px]"
        onClick={() => setWishlistOpen(false)}
      />
      <div className="relative z-10 w-full max-w-md bg-[#D7E5F5] h-full flex flex-col border-l border-[#092147]/12">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#092147]/10">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#092147]">
              Saved Wishlist
            </h2>
            <p className="text-xs text-[#092147]/60 tabular-nums">
              {items.length} {items.length === 1 ? 'item' : 'items'} curated
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWishlistOpen(false)}
            aria-label="Close wishlist"
            className="p-2 text-[#092147] hover:bg-[#BDD4EE]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Heart className="w-8 h-8 text-[#3E70B3] mx-auto stroke-[1.25]" />
              <p className="font-editorial text-2xl text-[#092147]">Your wishlist is empty</p>
              <p className="text-sm text-[#092147]/65 max-w-xs mx-auto leading-relaxed">
                Save foundations, lipsticks, and cheek shades as you explore the seven houses.
              </p>
              <button
                type="button"
                onClick={() => navigate({ view: 'shop' })}
                className="mt-2 inline-block px-5 py-2.5 bg-[#092147] text-[#D7E5F5] text-xs tracking-[0.06em]"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            items.map(({ product, shade }) => {
              const brand = getBrandById(product.brandId);
              return (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#E9F1FB] border border-[#092147]/10"
                >
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'product', slug: product.slug })}
                    className="w-20 h-24 bg-[#C7DAEE] shrink-0 overflow-hidden"
                  >
                    <ProductImage
                      src={product.mainImage}
                      alt={product.name}
                      fallbackTitle={product.name}
                    />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] tracking-[0.06em] text-[#092147]/60 truncate">
                        {brand?.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate({ view: 'product', slug: product.slug })}
                        className="font-editorial text-lg font-semibold text-[#092147] text-left hover:text-[#1D4E9E] transition-colors line-clamp-1"
                      >
                        {product.name}
                      </button>
                      {shade && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3 h-3 rounded-full border border-[#092147]/20 inline-block"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <span className="text-xs text-[#092147]/70 truncate">
                            {shade.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-medium tabular-nums text-[#092147]">
                        {formatINR(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="text-xs text-[#092147]/55 hover:text-[#1D4E9E] flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
