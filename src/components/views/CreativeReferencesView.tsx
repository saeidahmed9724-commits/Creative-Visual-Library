import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  ThumbsUp,
  Target,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Maximize2,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { CreativeReference } from '../../types';

export const CreativeReferencesView: React.FC = () => {
  const {
    t,
    creativeReferences,
    setIsAddCreativeRefModalOpen,
    setEditingCreativeRef,
    deleteCreativeReference,
    toggleStarCreativeReference,
  } = useLibrary();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.creativeReferences}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {creativeReferences.length} References
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Outside inspiration focusing on lighting techniques, camera framing, and executions without altering Brand DNA.
          </p>
        </div>

        <button
          onClick={() => setIsAddCreativeRefModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewCreativeRef}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creativeReferences.map((ref) => (
          <div
            key={ref.id}
            className="rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 overflow-hidden flex flex-col justify-between transition-all group hover:shadow-[0_0_24px_rgba(168,85,247,0.2)]"
          >
            <div>
              {/* Image */}
              <div
                onClick={() => setLightboxImage(ref.image)}
                className="relative aspect-video overflow-hidden bg-black/40 cursor-pointer"
              >
                <img
                  src={ref.image}
                  alt={ref.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12111a] via-transparent to-black/30" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStarCreativeReference(ref.id);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-white hover:text-purple-300"
                >
                  {ref.starred ? (
                    <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {ref.title}
                </h3>

                {/* What I Like */}
                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{t.whatILike}</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {ref.whatILike}
                  </p>
                </div>

                {/* Useful For */}
                <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                    <Target className="w-3.5 h-3.5" />
                    <span>{t.usefulFor}</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {ref.usefulFor}
                  </p>
                </div>

                {/* Tags */}
                {ref.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ref.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-0 flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  setEditingCreativeRef(ref);
                  setIsAddCreativeRefModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteCreativeReference(ref.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
