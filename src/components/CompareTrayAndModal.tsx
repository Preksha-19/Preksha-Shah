import React from 'react';
import { ArrowLeftRight, ExternalLink, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { formatINR } from '../data/catalogueSeed';
import { ProductImage } from './ProductImage';

export const CompareTrayAndModal: React.FC = () => {
  const {
    compareIds,
    activeProducts,
    compareOpen,
    setCompareOpen,
    toggleCompare,
    clearCompare,
    getBrandById,
    navigate,
  } = useCatalogue();

  const items = compareIds
    .map((id) => activeProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <>
      {/* Minimal Floating Comparison Bar */}
      {!compareOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#092147] text-[#D7E5F5] px-4 py-2.5 shadow-lg border border-[#60A5FA]/10 flex items-center gap-4 max-w-[95vw]">
          <div className="flex items-center gap-2 text-xs">
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#3E70B3]" />
            <span className="tabular-nums font-medium whitespace-nowrap">
              {items.length} {items.length === 1 ? 'Product' : 'Products'} Selected
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {items.map((p) => (
              <span
                key={p.id}
                className="text-[11px] text-[#BDD4EE]/80 bg-[#E9F1FB]/10 px-2 py-0.5 max-w-[120px] truncate"
              >
                {p.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="px-3 py-1.5 bg-[#BDD4EE] text-[#092147] text-xs font-medium hover:bg-[#E9F1FB] transition-colors whitespace-nowrap"
            >
              Compare
            </button>
            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear comparison"
              className="p-1 text-[#BDD4EE]/70 hover:text-[#E6F0FD] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092147]/50 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Product Comparison"
        >
          <div className="bg-[#D7E5F5] w-full max-w-5xl max-h-[90vh] flex flex-col border border-[#092147]/15">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#092147]/10 bg-[#E9F1FB]">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#092147]">
                  Product Comparison
                </h2>
                <p className="text-xs text-[#092147]/60">
                  Verified formulation, shade count, and INR pricing comparison
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-xs text-[#1D4E9E] hover:text-[#092147] underline underline-offset-4"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close comparison"
                  className="p-2 text-[#092147] hover:bg-[#BDD4EE]/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-auto flex-1 p-6">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-40 py-3 pr-4 align-bottom text-xs tracking-[0.06em] text-[#092147]/60 font-semibold border-b border-[#092147]/10">
                      Specification
                    </th>
                    {items.map((product) => {
                      const brand = getBrandById(product.brandId);
                      return (
                        <th
                          key={product.id}
                          className="p-3 align-top border-b border-[#092147]/10 min-w-[180px]"
                        >
                          <div className="relative bg-[#E9F1FB] border border-[#092147]/10 p-3 space-y-2">
                            <button
                              type="button"
                              onClick={() => toggleCompare(product.id)}
                              aria-label={`Remove ${product.name}`}
                              className="absolute top-2 right-2 p-1 text-[#092147]/50 hover:text-[#092147]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="aspect-[4/5] w-28 mx-auto bg-[#C7DAEE] overflow-hidden">
                              <ProductImage
                                src={product.mainImage}
                                alt={product.name}
                                fallbackTitle={product.name}
                              />
                            </div>
                            <p className="text-[11px] tracking-[0.06em] text-[#092147]/60 font-normal">
                              {brand?.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setCompareOpen(false);
                                navigate({ view: 'product', slug: product.slug });
                              }}
                              className="font-editorial text-lg font-semibold text-[#092147] hover:text-[#1D4E9E] text-left block leading-snug"
                            >
                              {product.name}
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#092147]/8">
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Price</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 font-medium tabular-nums">
                        {formatINR(p.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Category</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-[#092147]/85">
                        {p.category} · {p.subcategory}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Finish</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-[#092147]/85">
                        {p.finish}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Coverage</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-[#092147]/85">
                        {p.coverage}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Formula</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-[#092147]/85">
                        {p.formulaType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Shades</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {p.shades.map((s) => (
                            <span
                              key={s.id}
                              title={s.name}
                              className="w-3.5 h-3.5 rounded-full border border-[#092147]/20"
                              style={{ backgroundColor: s.hex }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#092147]/60 tabular-nums">
                          {p.shades.length} curated shades
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Size</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 tabular-nums text-[#092147]/85">
                        {p.size}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Skin Type</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-[#092147]/80">
                        {p.skinTypes.join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-xs font-semibold text-[#092147]/65">Official Link</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3">
                        <a
                          href={p.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#092147] underline underline-offset-4 hover:text-[#1D4E9E]"
                        >
                          <span>Visit House</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
