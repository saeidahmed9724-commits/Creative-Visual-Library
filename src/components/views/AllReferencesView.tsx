import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Trash2,
  Filter,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const AllReferencesView: React.FC = () => {
  const {
    t,
    galleryReferences,
    addGalleryReference,
    deleteGalleryReference,
    brands,
    activeBrandId,
  } = useLibrary();

  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredReferences = galleryReferences.filter((ref) => {
    if (selectedBrandFilter === 'all') return true;
    return ref.brandId === selectedBrandFilter;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    addGalleryReference({
      url: newUrl.trim(),
      title: newTitle.trim() || 'Visual Reference',
      tags: ['Reference'],
      brandId: activeBrandId,
    });
    setNewUrl('');
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.allReferences}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {filteredReferences.length} Images
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Central visual wall of curated reference photographs and moodboard assets.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reference</span>
        </button>
      </div>

      {/* Add Reference Quick Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-2xl bg-[#14121f] border border-purple-500/30 space-y-3 animate-in fade-in"
        >
          <h3 className="text-xs font-bold text-white">Add New Reference Image</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Image URL (https://...)"
              required
              className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title / Description (optional)"
              className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-neutral-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-600 text-xs font-medium text-white shadow-sm"
            >
              {t.save}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap bg-[#12111a] p-2.5 rounded-xl border border-white/5">
        <span className="text-xs text-neutral-400 flex items-center gap-1.5 pl-2 pr-1">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Brand:</span>
        </span>
        <button
          onClick={() => setSelectedBrandFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            selectedBrandFilter === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {t.all}
        </button>
        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBrandFilter(b.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedBrandFilter === b.id
                ? 'bg-purple-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Visual Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredReferences.map((ref) => (
          <div
            key={ref.id}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <img
              src={ref.url}
              alt={ref.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setLightboxImage(ref.url)}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteGalleryReference(ref.id)}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600/80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[11px] font-medium text-white truncate block">
                {ref.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-purple-500/30">
            <img src={lightboxImage} alt="Reference" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
