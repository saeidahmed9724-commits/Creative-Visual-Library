import React from 'react';
import { Edit2, Sparkles } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { BrandSubTab } from '../types';

export const BrandHeader: React.FC = () => {
  const {
    t,
    activeBrand,
    brandSubTab,
    setBrandSubTab,
    setEditingBrand,
    setIsAddBrandModalOpen,
  } = useLibrary();

  if (!activeBrand) return null;

  const subTabs: { id: BrandSubTab; label: string }[] = [
    { id: 'overview', label: t.overview },
    { id: 'brand-dna', label: t.brandDna },
    { id: 'visual-directions', label: t.visualDirections },
    { id: 'references', label: t.references },
    { id: 'products', label: t.products },
    { id: 'creative-references', label: t.creativeReferences },
    { id: 'notes', label: t.notesTab },
  ];

  return (
    <div className="space-y-4">
      {/* Brand Profile Banner Card */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-xl relative overflow-hidden">
        {/* Subtle violet atmospheric ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Logo + Info */}
          <div className="flex items-start sm:items-center gap-5">
            {/* Brand Logo Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#111111] border border-[#1F1F1F] flex flex-col items-center justify-center p-2 flex-shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.15)] group">
              <span className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight">
                {activeBrand.logoText || activeBrand.name.charAt(0)}
              </span>
              <span className="text-[8px] tracking-widest text-violet-400 font-bold mt-0.5 uppercase text-center truncate w-full">
                {activeBrand.name.split(' ')[0]}
              </span>
            </div>

            {/* Title, Edit & Description */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeBrand.name}
                </h1>
                <span className="bg-violet-900/30 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded border border-violet-500/30 uppercase tracking-wider">
                  PREMIUM BRAND
                </span>
                <button
                  onClick={() => {
                    setEditingBrand(activeBrand);
                    setIsAddBrandModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A] hover:bg-violet-600/20 text-[#A1A1AA] hover:text-white border border-[#2D2D2D] hover:border-violet-500/30 text-xs font-medium transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-violet-400" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                {activeBrand.description}
              </p>

              {/* Metadata row with Atmospheric Media styling */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52525B] text-[11px]">{t.category}:</span>
                  <span className="text-[#E0E0E0] font-medium">{activeBrand.category}</span>
                </div>
                <span className="text-[#2D2D2D]">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52525B] text-[11px]">{t.founded}:</span>
                  <span className="text-[#E0E0E0] font-medium">{activeBrand.founded}</span>
                </div>
                <span className="text-[#2D2D2D]">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52525B] text-[11px]">{t.personality}:</span>
                  <span className="text-violet-400 font-medium">{activeBrand.personality}</span>
                </div>
                <span className="text-[#2D2D2D]">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52525B] text-[11px]">{t.visualStyle}:</span>
                  <span className="text-[#E0E0E0] font-medium">{activeBrand.visualStyle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Brand Colors Swatches */}
          <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-bold">
              {t.brandColors}
            </span>
            <div className="flex items-center gap-2 bg-[#111111] p-2 rounded-2xl border border-[#1F1F1F]">
              {activeBrand.brandColors.map((color, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(color);
                  }}
                  title={`${color} (Click to copy)`}
                >
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#050505] transition-transform hover:scale-110 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] bg-[#1A1A1A] text-white px-1.5 py-0.5 rounded border border-[#2D2D2D] opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap z-20">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Sub-Navigation Tabs */}
      <div className="border-b border-[#1F1F1F] flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
        {subTabs.map((tab) => {
          const isActive = brandSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setBrandSubTab(tab.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
