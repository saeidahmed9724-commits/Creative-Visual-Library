import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const PromptModal: React.FC = () => {
  const {
    t,
    isAddPromptModalOpen,
    setIsAddPromptModalOpen,
    editingPrompt,
    setEditingPrompt,
    addPrompt,
    updatePrompt,
    activeBrandId,
  } = useLibrary();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Editorial');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [usage, setUsage] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  useEffect(() => {
    if (editingPrompt) {
      setName(editingPrompt.name);
      setCategory(editingPrompt.category);
      setPrompt(editingPrompt.prompt);
      setStyle(editingPrompt.style || '');
      setUsage(editingPrompt.usage || '');
      setTagsStr(editingPrompt.tags?.join(', ') || '');
    } else {
      setName('');
      setCategory('Editorial');
      setPrompt('');
      setStyle('');
      setUsage('');
      setTagsStr('');
    }
  }, [editingPrompt, isAddPromptModalOpen]);

  if (!isAddPromptModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    if (editingPrompt) {
      updatePrompt(editingPrompt.id, {
        name,
        category,
        prompt,
        style,
        usage,
        tags,
      });
    } else {
      addPrompt({
        brandId: activeBrandId,
        name,
        category,
        prompt,
        style,
        usage,
        tags,
        starred: false,
      });
    }

    setIsAddPromptModalOpen(false);
    setEditingPrompt(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingPrompt ? t.edit : t.addNewPrompt}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddPromptModalOpen(false);
              setEditingPrompt(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Prompt Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Luxury Editorial — Hair Campaign"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              >
                <option value="Editorial">Editorial</option>
                <option value="Product">Product</option>
                <option value="Motion">Motion</option>
                <option value="Portrait">Portrait</option>
                <option value="Minimal">Minimal</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Style / Medium
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g. 35mm Analog, 8k Studio"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Prompt String *
            </label>
            <textarea
              rows={5}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Detailed prompt text for AI generation..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-purple-200 font-mono focus:outline-none focus:border-purple-500/60 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Recommended Usage
              </label>
              <input
                type="text"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="e.g. Hero billboard, Instagram feed"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="editorial, hair, studio"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddPromptModalOpen(false);
                setEditingPrompt(null);
              }}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
