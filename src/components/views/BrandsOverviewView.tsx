import React from 'react';
import {
  Building2,
  Plus,
  ArrowRight,
  Edit,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const BrandsOverviewView: React.FC = () => {
  const {
    t,
    brands,
    directions,
    products,
    setActiveBrandId,
    setActiveNav,
    setBrandSubTab,
    setIsAddBrandModalOpen,
    setEditingBrand,
    deleteBrand,
  } = useLibrary();

  const handleSelectBrand = (brandId: string) => {
    setActiveBrandId(brandId);
    setBrandSubTab('overview');
    setActiveNav('dashboard');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.brands}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {brands.length} Brands
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Isolated creative workspaces with independent Brand DNA, directions, and product catalogs.
          </p>
        </div>

        <button
          onClick={() => setIsAddBrandModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewBrand}</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const brandDirs = directions.filter((d) => d.brandId === brand.id);
          const brandProds = products.filter((p) => p.brandId === brand.id);

          return (
            <div
              key={brand.id}
              onClick={() => handleSelectBrand(brand.id)}
              className="rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all cursor-pointer group hover:shadow-[0_0_24px_rgba(168,85,247,0.25)] relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Brand header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Stylized Logo box */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a1334] via-[#1e1329] to-[#0d0a14] border border-purple-400/30 flex flex-col items-center justify-center p-1.5 flex-shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.25)] group-hover:border-purple-400/60 transition-colors">
                      <span className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-purple-200 to-purple-400 font-bold">
                        {brand.logoText || brand.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {brand.name}
                      </h3>
                      <span className="text-xs text-purple-300/80 font-medium">
                        {brand.category} • Est. {brand.founded}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingBrand(brand);
                        setIsAddBrandModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {brands.length > 1 && (
                      <button
                        onClick={() => deleteBrand(brand.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                {/* Color swatches */}
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">
                    Brand Palette
                  </span>
                  <div className="flex items-center gap-1.5">
                    {brand.brandColors.map((color, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span>{brandDirs.length} {t.visualDirections}</span>
                  <span>•</span>
                  <span>{brandProds.length} {t.products}</span>
                </div>

                <div className="flex items-center gap-1 text-purple-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Open Space</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Brand Card */}
        <div
          onClick={() => setIsAddBrandModalOpen(true)}
          className="rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-400/40 hover:bg-purple-950/10 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-3 border border-purple-500/30">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
            {t.addNewBrand}
          </span>
          <span className="text-xs text-neutral-500 mt-1">
            Create an isolated creative workspace
          </span>
        </div>
      </div>
    </div>
  );
};
