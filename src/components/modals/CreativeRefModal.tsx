import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { ImageUploadField } from '../ImageUploadField';

export const CreativeRefModal: React.FC = () => {
  const {
    t,
    isAddCreativeRefModalOpen,
    setIsAddCreativeRefModalOpen,
    editingCreativeRef,
    setEditingCreativeRef,
    addCreativeReference,
    updateCreativeReference,
  } = useLibrary();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [whatILike, setWhatILike] = useState('');
  const [usefulFor, setUsefulFor] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  useEffect(() => {
    if (editingCreativeRef) {
      setTitle(editingCreativeRef.title);
      setImage(editingCreativeRef.image);
      setWhatILike(editingCreativeRef.whatILike);
      setUsefulFor(editingCreativeRef.usefulFor);
      setTagsStr(editingCreativeRef.tags?.join(', ') || '');
    } else {
      setTitle('');
      setImage(
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
      );
      setWhatILike('');
      setUsefulFor('');
      setTagsStr('');
    }
  }, [editingCreativeRef, isAddCreativeRefModalOpen]);

  if (!isAddCreativeRefModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    if (editingCreativeRef) {
      updateCreativeReference(editingCreativeRef.id, {
        title,
        image,
        whatILike,
        usefulFor,
        tags,
      });
    } else {
      addCreativeReference({
        title,
        image,
        whatILike: whatILike || 'Lighting technique, composition, color grading',
        usefulFor: usefulFor || 'Campaign visuals, social hero shots',
        tags,
        starred: false,
      });
    }

    setIsAddCreativeRefModalOpen(false);
    setEditingCreativeRef(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingCreativeRef ? t.edit : t.addNewCreativeRef}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddCreativeRefModalOpen(false);
              setEditingCreativeRef(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dior Sauvage Desert Lighting"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <ImageUploadField
            label="Image"
            required
            value={image}
            onChange={setImage}
            folder="creative-refs"
            idHint={editingCreativeRef?.id}
          />

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.whatILike}
            </label>
            <textarea
              rows={2}
              value={whatILike}
              onChange={(e) => setWhatILike(e.target.value)}
              placeholder="e.g. Camera angle, rim lighting, glass reflection..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.usefulFor}
            </label>
            <textarea
              rows={2}
              value={usefulFor}
              onChange={(e) => setUsefulFor(e.target.value)}
              placeholder="e.g. Product launch hero, luxury editorial..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
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
              placeholder="lighting, bottle, glass, shadow"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddCreativeRefModalOpen(false);
                setEditingCreativeRef(null);
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
