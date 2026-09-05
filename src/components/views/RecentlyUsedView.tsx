import React, { useMemo } from 'react';
import { Clock, Building2, Compass, FileText, Package, Sparkles, Camera, Lightbulb, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { TrashItemType } from '../../types';

interface RecentEntry {
  id: string;
  type: TrashItemType;
  title: string;
  subtitle?: string;
  image?: string;
  at: string;
}

export const RecentlyUsedView: React.FC = () => {
  const {
    t,
    lang,
    brands,
    directions,
    analyses,
    products,
    prompts,
    cameraAngles,
    creativeReferences,
    galleryReferences,
    setActiveNav,
    setActiveBrandId,
    setBrandSubTab,
    setSelectedDirectionId,
    setEditingPrompt,
    setIsAddPromptModalOpen,
    setEditingAngle,
    setIsAddAngleModalOpen,
    setEditingCreativeRef,
    setIsAddCreativeRefModalOpen,
    setEditingProduct,
    setIsAddProductModalOpen,
  } = useLibrary();

  const entries = useMemo<RecentEntry[]>(() => {
    const brandName = (id?: string) => brands.find((b) => b.id === id)?.name;
    const list: RecentEntry[] = [
      ...brands.map((b) => ({ id: b.id, type: 'brand' as const, title: b.name, subtitle: b.category, image: b.coverImage, at: b.updatedAt || b.createdAt })),
      ...directions.map((d) => ({ id: d.id, type: 'direction' as const, title: d.name, subtitle: brandName(d.brandId), image: d.image, at: d.updatedAt || d.createdAt })),
      ...analyses.map((a) => ({ id: a.id, type: 'analysis' as const, title: a.title, subtitle: brandName(a.brandId), image: a.references?.[0], at: a.updatedAt || a.createdAt })),
      ...products.map((p) => ({ id: p.id, type: 'product' as const, title: p.name, subtitle: brandName(p.brandId), image: p.mainImage, at: p.updatedAt || p.createdAt })),
      ...prompts.map((p) => ({ id: p.id, type: 'prompt' as const, title: p.name, subtitle: p.category, image: p.imageUrl, at: p.updatedAt || p.createdAt })),
      ...cameraAngles.map((c) => ({ id: c.id, type: 'cameraAngle' as const, title: c.name, subtitle: c.shotType, image: c.image, at: c.updatedAt || c.createdAt })),
      ...creativeReferences.map((r) => ({ id: r.id, type: 'creativeReference' as const, title: r.title, subtitle: r.tags?.slice(0, 2).join(', '), image: r.image, at: r.updatedAt || r.createdAt })),
      ...galleryReferences.map((r) => ({ id: r.id, type: 'galleryReference' as const, title: r.title || 'Reference', image: r.url, at: r.updatedAt || r.createdAt })),
    ];
    return list
      .filter((e) => e.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 40);
  }, [brands, directions, analyses, products, prompts, cameraAngles, creativeReferences, galleryReferences]);

  const typeMeta: Record<TrashItemType, { label: string; icon: React.ReactNode }> = {
    brand: { label: t.typeBrand, icon: <Building2 className="w-3.5 h-3.5" /> },
    direction: { label: t.typeDirection, icon: <Compass className="w-3.5 h-3.5" /> },
    analysis: { label: t.typeAnalysis, icon: <FileText className="w-3.5 h-3.5" /> },
    product: { label: t.typeProduct, icon: <Package className="w-3.5 h-3.5" /> },
    prompt: { label: t.typePrompt, icon: <Sparkles className="w-3.5 h-3.5" /> },
    cameraAngle: { label: t.typeAngle, icon: <Camera className="w-3.5 h-3.5" /> },
    creativeReference: { label: t.typeCreativeRef, icon: <Lightbulb className="w-3.5 h-3.5" /> },
    galleryReference: { label: t.typeGalleryRef, icon: <ImageIcon className="w-3.5 h-3.5" /> },
  };

  const open = (e: RecentEntry) => {
    switch (e.type) {
      case 'brand':
        setActiveBrandId(e.id);
        setBrandSubTab('overview');
        setActiveNav('dashboard');
        break;
      case 'direction': {
        const d = directions.find((x) => x.id === e.id);
        if (d) setActiveBrandId(d.brandId);
        setSelectedDirectionId(e.id);
        setBrandSubTab('visual-directions');
        setActiveNav('dashboard');
        break;
      }
      case 'analysis': {
        const a = analyses.find((x) => x.id === e.id);
        if (a) {
          setActiveBrandId(a.brandId);
          setSelectedDirectionId(a.directionId);
        }
        setBrandSubTab('visual-directions');
        setActiveNav('dashboard');
        break;
      }
      case 'product': {
        const p = products.find((x) => x.id === e.id);
        if (p) {
          setEditingProduct(p);
          setIsAddProductModalOpen(true);
        }
        break;
      }
      case 'prompt': {
        const p = prompts.find((x) => x.id === e.id);
        if (p) {
          setEditingPrompt(p);
          setIsAddPromptModalOpen(true);
        }
        break;
      }
      case 'cameraAngle': {
        const c = cameraAngles.find((x) => x.id === e.id);
        if (c) {
          setEditingAngle(c);
          setIsAddAngleModalOpen(true);
        }
        break;
      }
      case 'creativeReference': {
        const r = creativeReferences.find((x) => x.id === e.id);
        if (r) {
          setEditingCreativeRef(r);
          setIsAddCreativeRefModalOpen(true);
        }
        break;
      }
      case 'galleryReference':
        setActiveNav('allReferences');
        break;
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-400" />
          {t.recentlyUsedTitle}
        </h2>
        <p className="text-xs text-[#A1A1AA] mt-1">{t.recentlyUsedDesc}</p>
      </div>

      {entries.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#2D2D2D] bg-[#0A0A0A] text-center text-sm text-[#71717A]">
          {t.noRecentItems}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map((e) => (
            <button
              key={`${e.type}-${e.id}`}
              onClick={() => open(e)}
              className="group flex items-center gap-4 p-3 rounded-xl bg-[#0F0F0F] border border-[#1F1F1F] hover:border-violet-500/40 hover:bg-[#131313] transition-all text-start"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1A1A1A] border border-[#262626] flex-shrink-0 flex items-center justify-center text-violet-400">
                {e.image ? (
                  <img src={e.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  typeMeta[e.type].icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-[10px] font-semibold text-violet-300 uppercase tracking-wider">
                    {typeMeta[e.type].icon}
                    {typeMeta[e.type].label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{e.title}</p>
                <p className="text-[11px] text-[#71717A] truncate">
                  {e.subtitle ? `${e.subtitle} • ` : ''}
                  {fmt(e.at)}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#52525B] group-hover:text-violet-400 transition-colors rtl:rotate-180 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
