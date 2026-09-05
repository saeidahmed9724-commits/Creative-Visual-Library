import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Maximize2,
  X,
  ExternalLink,
  UploadCloud } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { PromptItem } from '../../types';

export const PromptLibraryView: React.FC = () => {
  const {
    t,
    lang,
    prompts,
    setIsAddPromptModalOpen,
    setEditingPrompt,
    deletePrompt,
    toggleStarPrompt,
  } = useLibrary();

  const isRTL = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ['all', 'Editorial', 'Product', 'Motion', 'Portrait', 'Minimal'];

  const filteredPrompts = prompts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (p: PromptItem) => {
    navigator.clipboard.writeText(p.prompt);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.promptLibrary}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30 font-mono">
              {prompts.length} Prompts
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {isRTL
              ? 'مكتبة برومتس مختبرة ومرفق بها صور النتائج من Midjourney و Flux مع إمكانية الرفع على Supabase.'
              : 'Tested & reusable master prompts with visual AI outputs hosted on Supabase Storage.'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPrompt(null);
            setIsAddPromptModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewPrompt}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12111a] p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? t.all : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'ابحث في البرومتس أو الوسوم...' : 'Search prompts or tags...'}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Prompts List & Cards */}
      <div className="space-y-4">
        {filteredPrompts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#12111a] border border-white/5 text-center text-xs text-neutral-400">
            {t.noPrompts}
          </div>
        ) : (
          filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Result Image (If available) */}
                {p.imageUrl ? (
                  <div className="relative group/thumb md:w-52 lg:w-64 shrink-0 rounded-xl overflow-hidden border border-purple-500/25 bg-black/60 aspect-[16/10] md:aspect-auto md:min-h-[170px]">
                    <img
                      src={p.imageUrl || undefined}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105 cursor-pointer"
                      onClick={() => setLightboxImage(p.imageUrl!)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-purple-300 border border-purple-500/40 text-[10px] font-medium font-mono shadow-sm">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>{isRTL ? 'صورة النتيجة' : 'Result Output'}</span>
                      </span>
                    </div>

                    {/* Image Action Buttons */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <button
                        onClick={() => setLightboxImage(p.imageUrl!)}
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-purple-600 text-white border border-white/20 transition-colors cursor-pointer"
                        title={t.viewFullImage || 'View Full Image'}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrompt(p);
                          setIsAddPromptModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-purple-600 text-white border border-white/20 transition-colors cursor-pointer"
                        title={t.edit}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* No image attached - Subtle Quick Add trigger */
                  <div
                    onClick={() => {
                      setEditingPrompt(p);
                      setIsAddPromptModalOpen(true);
                    }}
                    className="md:w-36 shrink-0 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 bg-black/20 hover:bg-purple-950/15 p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group/noimg"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600/15 flex items-center justify-center text-purple-400 group-hover/noimg:scale-110 transition-transform mb-1.5">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-neutral-400 group-hover/noimg:text-purple-300 font-medium">
                      {isRTL ? 'إرفاق صورة نتيجة' : 'Attach Output'}
                    </span>
                    <span className="text-[9px] text-neutral-500 mt-0.5 font-mono">
                      Supabase Storage
                    </span>
                  </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  {/* Card top bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/20 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/20 font-medium">
                            {p.category}
                          </span>
                          {p.style && (
                            <span className="text-[10px] text-neutral-400 truncate">
                              • {p.style}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(p)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-medium transition-all cursor-pointer"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === p.id ? t.copied : t.copyPrompt}</span>
                      </button>

                      <button
                        onClick={() => toggleStarPrompt(p.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-400 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        {p.starred ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingPrompt(p);
                          setIsAddPromptModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                        title={t.edit}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deletePrompt(p.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Prompt box */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-purple-200/90 leading-relaxed select-all">
                    {p.prompt}
                  </div>

                  {/* Tags & notes */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {p.usage && (
                      <span className="text-[11px] text-neutral-400 italic">
                        {isRTL ? `المجال: ${p.usage}` : `Best for: ${p.usage}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-[#12111a] p-3 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs">
              <span className="text-purple-300 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{isRTL ? 'معاينة صورة نتيجة البرومبت' : 'Prompt Output Result Preview'}</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'فتح الأصل' : 'Open Original'}</span>
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-full overflow-auto max-h-[78vh] flex items-center justify-center p-1">
              <img
                src={lightboxImage}
                alt="Prompt result"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl border border-white/10 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

