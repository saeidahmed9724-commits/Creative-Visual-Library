import React, { useState, useEffect } from 'react';
import { X, Compass } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const DirectionModal: React.FC = () => {
  const {
    t,
    isAddDirectionModalOpen,
    setIsAddDirectionModalOpen,
    editingDirection,
    setEditingDirection,
    addDirection,
    updateDirection,
    brands,
    activeBrandId,
  } = useLibrary();

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [targetBrandId, setTargetBrandId] = useState(activeBrandId);

  useEffect(() => {
    if (editingDirection) {
      setName(editingDirection.name);
      setSubtitle(editingDirection.subtitle);
      setImage(editingDirection.image);
      setTargetBrandId(editingDirection.brandId);
    } else {
      setName('');
      setSubtitle('');
      setImage(
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
      );
      setTargetBrandId(activeBrandId);
    }
  }, [editingDirection, isAddDirectionModalOpen, activeBrandId]);

  if (!isAddDirectionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingDirection) {
      updateDirection(editingDirection.id, {
        name,
        subtitle,
        image,
        brandId: targetBrandId,
      });
    } else {
      addDirection({
        brandId: targetBrandId,
        name,
        subtitle: subtitle || 'Refined Aesthetic',
        image:
          image ||
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        analysesCount: 0,
        starred: false,
      });
    }

    setIsAddDirectionModalOpen(false);
    setEditingDirection(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingDirection ? t.edit : t.addVisualDirection}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddDirectionModalOpen(false);
              setEditingDirection(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Target Brand
            </label>
            <select
              value={targetBrandId}
              onChange={(e) => setTargetBrandId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Direction Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Luxury Editorial, Product Focused"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Subtitle / Keywords
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Premium • Sophisticated • Minimal"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
            {image && (
              <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddDirectionModalOpen(false);
                setEditingDirection(null);
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
