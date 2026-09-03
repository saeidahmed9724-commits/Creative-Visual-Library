import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Copy,
  Check,
  Tag,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { PromptItem } from '../../types';

export const PromptLibraryView: React.FC = () => {
  const {
    t,
    prompts,
    setIsAddPromptModalOpen,
    setEditingPrompt,
    deletePrompt,
    toggleStarPrompt,
  } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {prompts.length} Prompts
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Tested & reusable master prompts for Midjourney, Flux, and AI image workflows.
          </p>
        </div>

        <button
          onClick={() => setIsAddPromptModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
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
            placeholder="Search prompts or tags..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Prompts List & Cards */}
      <div className="space-y-3">
        {filteredPrompts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#12111a] border border-white/5 text-center text-xs text-neutral-400">
            {t.noPrompts}
          </div>
        ) : (
          filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 transition-all space-y-3 group"
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/20 font-medium">
                        {p.category}
                      </span>
                      {p.style && (
                        <span className="text-[10px] text-neutral-400">
                          • {p.style}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(p)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-medium transition-all"
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
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-400 hover:bg-white/5"
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
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                    title={t.edit}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deletePrompt(p.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
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
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {p.usage && (
                  <span className="text-[11px] text-neutral-400 italic">
                    Best for: {p.usage}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
