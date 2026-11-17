import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';

export const Footer: React.FC = () => {
  const { activeBrands, navigate } = useCatalogue();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#051229] text-[#D7E5F5] mt-20 border-t border-[#60A5FA]/25">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#60A5FA]/10">
          {/* Brand Editorial Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-editorial text-2xl font-medium tracking-[0.22em] block text-[#D7E5F5]">
              MAISON ÉDIT
            </span>
            <p className="text-sm text-[#BDD4EE]/70 leading-relaxed max-w-sm">
              An independent luxury beauty catalogue curating iconic makeup formulations across
              seven international houses. Verified shades, textures, and India retail guidance in INR.
            </p>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] tracking-[0.14em] font-medium text-[#60A5FA]">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BDD4EE]/80">
              {(['Face', 'Eyes', 'Lips', 'Cheeks'] as const).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'shop', category: cat })}
                    className="hover:text-[#E6F0FD] transition-colors"
                  >
                    {cat} Makeup
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'collections' })}
                  className="hover:text-[#E6F0FD] transition-colors"
                >
                  Curated Edits
                </button>
              </li>
            </ul>
          </div>

          {/* Houses */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] tracking-[0.14em] font-medium text-[#60A5FA]">
              Luxury Houses
            </h4>
            <ul className="grid grid-cols-1 gap-2.5 text-sm text-[#BDD4EE]/80">
              {activeBrands.map((brand) => (
                <li key={brand.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'brand', slug: brand.slug })}
                    className="hover:text-[#E6F0FD] transition-colors"
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] tracking-[0.14em] font-medium text-[#60A5FA]">
              The Beauty Dispatch
            </h4>
            <p className="text-xs text-[#BDD4EE]/65 leading-relaxed">
              Receive seasonal shade archives, new launch additions, and curated edits.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#BDD4EE] py-2">
                <Check className="w-4 h-4 text-[#60A5FA]" />
                <span>Subscribed to seasonal beauty dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border border-[#60A5FA]/35">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address for beauty dispatch"
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs text-[#E6F0FD] placeholder:text-[#E6F0FD]/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#60A5FA] text-[#051229] text-xs tracking-[0.08em] font-medium hover:bg-[#BDD4EE] transition-colors whitespace-nowrap shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#BDD4EE]/50">
          <p>
            © {new Date().getFullYear()} MAISON ÉDIT. Independent multi-brand discovery platform.
            All brand trademarks belong to their respective houses.
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate({ view: 'shop' })}
              className="hover:text-[#BDD4EE] transition-colors"
            >
              Full Index
            </button>
            <button
              type="button"
              onClick={() => navigate({ view: 'admin' })}
              className="hover:text-[#BDD4EE] transition-colors"
            >
              Atelier Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
