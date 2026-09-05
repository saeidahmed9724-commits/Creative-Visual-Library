import React from 'react';
import { Trash2, RotateCcw, XCircle, Building2, Compass, FileText, Package, Sparkles, Camera, Lightbulb, Image as ImageIcon } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { TrashItemType } from '../../types';

export const TrashView: React.FC = () => {
  const { t, lang, trash, restoreFromTrash, purgeTrashItem, emptyTrash } = useLibrary();

  const typeMeta: Record<TrashItemType, { label: string; icon: React.ReactNode }> = {
    brand: { label: t.typeBrand, icon: <Building2 className="w-4 h-4" /> },
    direction: { label: t.typeDirection, icon: <Compass className="w-4 h-4" /> },
    analysis: { label: t.typeAnalysis, icon: <FileText className="w-4 h-4" /> },
    product: { label: t.typeProduct, icon: <Package className="w-4 h-4" /> },
    prompt: { label: t.typePrompt, icon: <Sparkles className="w-4 h-4" /> },
    cameraAngle: { label: t.typeAngle, icon: <Camera className="w-4 h-4" /> },
    creativeReference: { label: t.typeCreativeRef, icon: <Lightbulb className="w-4 h-4" /> },
    galleryReference: { label: t.typeGalleryRef, icon: <ImageIcon className="w-4 h-4" /> },
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            {t.trashTitle}
            {trash.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] text-[#A1A1AA] font-mono">
                {trash.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">{t.trashDesc}</p>
        </div>
        {trash.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm(t.confirmDeleteForever)) emptyTrash();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
          >
            <XCircle className="w-4 h-4" />
            {t.emptyTrash}
          </button>
        )}
      </div>

      {trash.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#2D2D2D] bg-[#0A0A0A] text-center text-sm text-[#71717A]">
          {t.trashEmpty}
        </div>
      ) : (
        <div className="space-y-2">
          {trash.map((item) => {
            const childCount = item.children?.reduce((n, g) => n + g.items.length, 0) || 0;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-[#0F0F0F] border border-[#1F1F1F]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[#A1A1AA] flex-shrink-0">
                  {typeMeta[item.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[11px] text-[#71717A]">
                    {typeMeta[item.type].label}
                    {childCount > 0 ? ` • +${childCount} ${t.itemsCount}` : ''} • {t.deletedAt} {fmt(item.deletedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreFromTrash(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.restore}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t.confirmDeleteForever)) purgeTrashItem(item.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-rose-600/20 border border-[#2D2D2D] hover:border-rose-500/30 text-[#A1A1AA] hover:text-rose-300 text-xs font-semibold transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {t.deleteForever}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
