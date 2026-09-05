import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Compass,
  FileText,
  Sparkles,
  Camera,
  Package,
  Lightbulb,
  ArrowRight } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

type SearchItemType = 'direction' | 'analysis' | 'prompt' | 'angle' | 'product' | 'creativeRef';

interface SearchResultItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  brandName?: string;
  action: () => void;
}

export const CommandSearchModal: React.FC = () => {
  const {
    t,
    isCommandSearchOpen,
    setIsCommandSearchOpen,
    brands,
    directions,
    analyses,
    prompts,
    cameraAngles,
    products,
    creativeReferences,
    setSelectedDirectionId,
    setSelectedAnalysisId,
    setActiveBrandId,
    setBrandSubTab,
    setActiveNav,
    setEditingPrompt,
  } = useLibrary();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilterType('all');
    }
  }, [isCommandSearchOpen]);

  if (!isCommandSearchOpen) return null;

  // Build unified search index
  const allItems: SearchResultItem[] = [];

  // Directions
  directions.forEach((d) => {
    const brand = brands.find((b) => b.id === d.brandId);
    allItems.push({
      id: d.id,
      type: 'direction',
      title: d.name,
      subtitle: `${d.subtitle} • Visual Direction`,
      brandName: brand?.name,
      action: () => {
        if (d.brandId) setActiveBrandId(d.brandId);
        setSelectedDirectionId(d.id);
        setBrandSubTab('visual-directions');
        setActiveNav('dashboard');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Analyses
  analyses.forEach((a) => {
    const brand = brands.find((b) => b.id === a.brandId);
    allItems.push({
      id: a.id,
      type: 'analysis',
      title: a.title,
      subtitle: `${a.visualStyle?.slice(0, 45) || ''}... • Analysis`,
      brandName: brand?.name,
      action: () => {
        if (a.brandId) setActiveBrandId(a.brandId);
        setSelectedDirectionId(a.directionId);
        setSelectedAnalysisId(a.id);
        setBrandSubTab('visual-directions');
        setActiveNav('dashboard');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Prompts
  prompts.forEach((p) => {
    allItems.push({
      id: p.id,
      type: 'prompt',
      title: p.name,
      subtitle: `${p.category} • ${p.prompt.slice(0, 45)}...`,
      action: () => {
        setEditingPrompt(p);
        setActiveNav('promptLibrary');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Camera Angles
  cameraAngles.forEach((a) => {
    allItems.push({
      id: a.id,
      type: 'angle',
      title: a.name,
      subtitle: `${a.shotType} • Camera Angle`,
      action: () => {
        setActiveNav('cameraAngles');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Products
  products.forEach((prod) => {
    const brand = brands.find((b) => b.id === prod.brandId);
    allItems.push({
      id: prod.id,
      type: 'product',
      title: prod.name,
      subtitle: `${prod.category} • Product`,
      brandName: brand?.name,
      action: () => {
        if (prod.brandId) setActiveBrandId(prod.brandId);
        setBrandSubTab('products');
        setActiveNav('dashboard');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Creative References
  creativeReferences.forEach((r) => {
    allItems.push({
      id: r.id,
      type: 'creativeRef',
      title: r.title,
      subtitle: `${r.whatILike?.slice(0, 45)}... • Creative Reference`,
      action: () => {
        setActiveNav('creativeReferences');
        setIsCommandSearchOpen(false);
      },
    });
  });

  // Filter items
  const q = query.toLowerCase().trim();
  const results = allItems.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    if (!q) return matchesFilter;
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.brandName && item.brandName.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  const getTypeIcon = (type: SearchItemType) => {
    switch (type) {
      case 'direction':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'analysis':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'prompt':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'angle':
        return <Camera className="w-4 h-4 text-teal-400" />;
      case 'product':
        return <Package className="w-4 h-4 text-cyan-400" />;
      case 'creativeRef':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in"
      onClick={() => setIsCommandSearchOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1F1F1F] flex items-center gap-3 bg-[#0A0A0A]">
          <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder-[#52525B] focus:outline-none"
          />
          <button
            onClick={() => setIsCommandSearchOpen(false)}
            className="p-1 rounded text-[#52525B] hover:text-white cursor-pointer"
          >
            <kbd className="px-2 py-0.5 text-[10px] bg-[#1A1A1A] border border-[#2D2D2D] rounded text-[#A1A1AA]">
              ESC
            </kbd>
          </button>
        </div>

        {/* Filters pills */}
        <div className="flex items-center gap-1.5 p-2.5 px-4 bg-[#050505] border-b border-[#1F1F1F] overflow-x-auto text-[11px]">
          <span className="text-[#52525B] pr-1">{t.filters}:</span>
          {[
            { id: 'all', label: t.all },
            { id: 'direction', label: t.visualDirections },
            { id: 'analysis', label: t.analysesCount },
            { id: 'prompt', label: t.promptLibrary },
            { id: 'angle', label: t.cameraAngles },
            { id: 'product', label: t.products },
            { id: 'creativeRef', label: t.creativeReferences },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-violet-600 text-white font-bold shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="max-h-[55vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#52525B]">
              No matching items found for "{query}"
            </div>
          ) : (
            results.slice(0, 25).map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={item.action}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-violet-600/10 border border-transparent hover:border-violet-500/20 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D] group-hover:border-violet-500/30 transition-colors flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-[#A1A1AA] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.brandName && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#1A1A1A] text-[#A1A1AA] border border-[#2D2D2D]">
                      {item.brandName}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-violet-400 transition-colors group-hover:translate-x-0.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0A0A0A] border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-[#52525B] px-4">
          <span>Search across prompts, angles, directions, and analyses</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
