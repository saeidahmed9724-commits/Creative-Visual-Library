import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Maximize2,
  Camera,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { VisualDirection, PromptItem } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    t,
    activeBrand,
    directions,
    products,
    prompts,
    cameraAngles,
    galleryReferences,
    toggleStarDirection,
    setSelectedDirectionId,
    setBrandSubTab,
    setIsAddBrandModalOpen,
    setIsAddDirectionModalOpen,
    setIsAddProductModalOpen,
    setIsAddPromptModalOpen,
    setIsAddAngleModalOpen,
    setEditingPrompt,
  } = useLibrary();

  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  // Filter directions and products for the current active brand
  const brandDirections = directions.filter(
    (d) => !activeBrand || d.brandId === activeBrand.id
  );
  const brandProducts = products.filter(
    (p) => !activeBrand || p.brandId === activeBrand.id
  );

  const handleCopyPrompt = (prompt: PromptItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedPromptId(prompt.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleOpenDirection = (dirId: string) => {
    setSelectedDirectionId(dirId);
    setBrandSubTab('visual-directions');
  };

  // 8 palette swatches shown in the design image
  const defaultPalette = activeBrand?.brandColors?.length
    ? activeBrand.brandColors
    : [
        '#4B1E3F',
        '#7A4B6B',
        '#B98C8E',
        '#E7D9C6',
        '#F4EFE6',
        '#1E1E24',
        '#2C2C38',
        '#3A3A46',
      ];

  return (
    <div className="space-y-8 pb-12">
      {/* If no active brand, show clean zero-mock setup prompt */}
      {!activeBrand && (
        <div className="rounded-2xl bg-gradient-to-r from-violet-950/30 via-[#111111] to-[#0A0A0A] border border-violet-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <h3 className="text-sm font-semibold text-white">
                Supabase Live Database Active • Zero Fake Brands
              </h3>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              تم حذف كل البراندات الوهمية وإلغاء التخزين المحلي بالكامل. قاعدة بياناتك الآن نظيفة ومتصلة مباشرة بسحابة Supabase.
            </p>
          </div>
          <button
            onClick={() => setIsAddBrandModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ {t.addNewBrand || 'Create Brand'}</span>
          </button>
        </div>
      )}

      {/* Row 1: Visual Directions & References */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Directions (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
              {t.visualDirections}
            </h2>
            <button
              onClick={() => setBrandSubTab('visual-directions')}
              className="text-xs text-violet-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {brandDirections.slice(0, 4).map((dir, idx) => (
              <div
                key={dir.id}
                onClick={() => handleOpenDirection(dir.id)}
                className="group rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/50 p-2.5 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(124,58,237,0.25)] flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0A0A0A] mb-2.5">
                  <img
                    src={dir.image}
                    alt={dir.name}
                    className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />

                  {/* Direction Number tag */}
                  <div className="absolute top-2 left-2 z-20">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-violet-400 bg-[#050505]/70 px-1.5 py-0.5 rounded border border-violet-500/30 uppercase">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Bookmark button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarDirection(dir.id);
                    }}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-[#050505]/70 hover:bg-[#050505] text-[#A1A1AA] hover:text-violet-300 transition-colors border border-white/5"
                  >
                    {dir.starred ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="px-1 space-y-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                    {dir.name}
                  </h3>
                  <p className="text-[10px] text-[#A1A1AA] truncate">
                    {dir.subtitle}
                  </p>
                  <div className="pt-1 text-[10px] font-medium text-violet-400 flex items-center justify-between">
                    <span>{dir.analysesCount || 0} {t.analysesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* References Grid (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
              {t.references}
            </h2>
            <button
              onClick={() => setBrandSubTab('references')}
              className="text-xs text-violet-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {galleryReferences.slice(0, 6).map((ref) => (
              <div
                key={ref.id}
                onClick={() => setSelectedLightboxImage(ref.url)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/50 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              >
                <img
                  src={ref.url}
                  alt={ref.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale contrast-115"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button className="absolute top-1.5 right-1.5 p-1 rounded bg-[#050505]/80 text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bookmark className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-white font-medium truncate block">
                    {ref.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Products + Prompt Library + Camera Angles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Products (4 cols on lg) */}
        <div className="md:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
              {t.products}
            </h2>
            <button
              onClick={() => setBrandSubTab('products')}
              className="text-xs text-violet-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {brandProducts.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                className="rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/40 p-2 flex flex-col justify-between transition-all group cursor-pointer"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-[#0A0A0A] mb-1.5">
                  <img
                    src={prod.mainImage}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-white block truncate">
                    {prod.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] block truncate">
                    {prod.name.split(' ').slice(1).join(' ') || prod.category}
                  </span>
                </div>
              </div>
            ))}

            {/* If fewer than 4 products, show add button */}
            {brandProducts.length < 4 && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="aspect-square rounded-xl border border-dashed border-[#1F1F1F] hover:border-violet-500/50 hover:bg-violet-600/10 flex flex-col items-center justify-center text-[#52525B] hover:text-violet-300 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-medium">{t.addProduct}</span>
              </button>
            )}
          </div>
        </div>

        {/* Prompt Library (4 cols on lg) */}
        <div className="md:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
              {t.promptLibrary}
            </h2>
            <button
              onClick={() => setBrandSubTab('brand-dna')}
              className="text-xs text-violet-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {prompts.slice(0, 5).map((p) => (
              <div
                key={p.id}
                onClick={() => setEditingPrompt(p)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/40 hover:bg-[#161616] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-[#E0E0E0] group-hover:text-white truncate">
                    {p.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#A1A1AA] border border-[#2D2D2D] font-mono">
                    {p.category}
                  </span>
                  <button
                    onClick={(e) => handleCopyPrompt(p, e)}
                    className="p-1 rounded hover:bg-white/10 text-[#52525B] hover:text-violet-300 transition-colors"
                    title={t.copyPrompt}
                  >
                    {copiedPromptId === p.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsAddPromptModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-[#1F1F1F] hover:border-violet-500/40 hover:bg-violet-600/10 text-xs text-[#52525B] hover:text-violet-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addNewPrompt}</span>
            </button>
          </div>
        </div>

        {/* Camera Angles (4 cols on lg) */}
        <div className="md:col-span-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
              {t.cameraAngles}
            </h2>
            <button
              onClick={() => setBrandSubTab('brand-dna')}
              className="text-xs text-violet-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {cameraAngles.slice(0, 4).map((angle) => (
              <div
                key={angle.id}
                className="group rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/40 p-2 flex flex-col justify-between transition-all cursor-pointer"
              >
                {/* Visual schematic representation */}
                <div className="aspect-square rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-center p-2 mb-1.5 relative overflow-hidden group-hover:border-violet-500/40 transition-colors">
                  {angle.diagramType === '45-degree' && (
                    <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="5" width="14" height="14" rx="2" strokeDasharray="2 2" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                    </svg>
                  )}
                  {angle.diagramType === 'low-angle' && (
                    <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="7" r="3" />
                      <path d="M5 21l7-10 7 10" />
                      <line x1="12" y1="17" x2="12" y2="21" strokeDasharray="2 2" />
                    </svg>
                  )}
                  {angle.diagramType === 'top-down' && (
                    <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  )}
                  {angle.diagramType === 'close-up' && (
                    <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
                      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
                      <path d="M9 12h6M12 9v6" />
                    </svg>
                  )}
                  {!angle.diagramType && (
                    <Camera className="w-6 h-6 text-violet-400/80" />
                  )}
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-white block truncate">
                    {angle.name}
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] block truncate">
                    {angle.shotType}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsAddAngleModalOpen(true)}
            className="w-full py-2 rounded-xl border border-dashed border-[#1F1F1F] hover:border-violet-500/40 hover:bg-violet-600/10 text-xs text-[#52525B] hover:text-violet-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addNewAngle}</span>
          </button>
        </div>
      </div>

      {/* Row 3: Bottom Color Palette & Typography Bar */}
      <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Color Palette section */}
        <div className="space-y-2 flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
            {t.colorPalette}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {defaultPalette.map((color, i) => (
              <div
                key={i}
                className="group relative cursor-pointer"
                onClick={() => navigator.clipboard.writeText(color)}
                title="Click to copy hex"
              >
                <div
                  className="w-12 h-10 rounded-xl border border-[#1F1F1F] transition-transform group-hover:scale-105 shadow-md flex items-center justify-center"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-mono text-[#A1A1AA] block text-center mt-1">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-[#1F1F1F]" />

        {/* Typography section */}
        <div className="space-y-2 flex-shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-[#52525B]">
            {t.typography}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-white tracking-tight">
              Aa
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {t.primaryFont}
              </span>
              <span className="text-xs text-[#A1A1AA]">
                {t.fontWeights}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for References */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-violet-500/40 shadow-[0_0_50px_rgba(124,58,237,0.3)]">
            <img
              src={selectedLightboxImage}
              alt="Reference preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#111111] text-white hover:bg-violet-600 transition-colors border border-[#1F1F1F]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
