import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';

export const AnnouncementBar: React.FC = () => {
  const { homepageConfig } = useCatalogue();
  const [dismissed, setDismissed] = useState(false);

  if (!homepageConfig.announcementVisible || dismissed) return null;

  return (
    <div className="bg-[#071936] text-[#BDD4EE] px-4 py-2 text-center relative border-b border-[#60A5FA]/20">
      <p className="text-[11px] tracking-[0.14em] font-normal pr-6 truncate">
        {homepageConfig.announcementText}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#60A5FA]/70 hover:text-[#D7E5F5] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#60A5FA]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
