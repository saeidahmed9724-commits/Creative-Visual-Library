import React, { useState, useEffect } from 'react';
import { X, Building2, Plus, Trash2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { Brand } from '../../types';

export const BrandModal: React.FC = () => {
  const {
    t,
    isAddBrandModalOpen,
    setIsAddBrandModalOpen,
    editingBrand,
    setEditingBrand,
    addBrand,
    updateBrand,
    setActiveBrandId,
  } = useLibrary();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [founded, setFounded] = useState('');
  const [personality, setPersonality] = useState('');
  const [visualStyle, setVisualStyle] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>(['#4B1E3F', '#7A4B6B', '#14121d']);
  const [newColor, setNewColor] = useState('#A855F7');

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setCategory(editingBrand.category);
      setFounded(editingBrand.founded);
      setPersonality(editingBrand.personality);
      setVisualStyle(editingBrand.visualStyle);
      setDescription(editingBrand.description);
      setColors(editingBrand.brandColors || []);
    } else {
      setName('');
      setCategory('');
      setFounded('2024');
      setPersonality('');
      setVisualStyle('');
      setDescription('');
      setColors(['#4B1E3F', '#7A4B6B', '#E7D9C6', '#1E1E24']);
    }
  }, [editingBrand, isAddBrandModalOpen]);

  if (!isAddBrandModalOpen) return null;

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name,
        category,
        founded,
        personality,
        visualStyle,
        description,
        brandColors: colors,
      });
    } else {
      const newB = addBrand({
        name,
        category: category || 'Luxury Care',
        founded: founded || '2024',
        personality: personality || 'Premium • Modern',
        visualStyle: visualStyle || 'Editorial • Cinematic',
        description,
        brandColors: colors,
        brandCore: {
          personality,
          positioning: '',
          generalVisualIdentity: visualStyle,
          generalColors: colors.join(', '),
          typography: 'Poppins • Sans-serif',
          materials: 'Glass, Metal, Matte',
          generalPhotographyPrinciples: 'Diffused studio lighting, rich contrast',
          thingsToAvoid: 'Cluttered backgrounds, flat lighting',
          notes: '',
        },
      });
      setActiveBrandId(newB.id);
    }

    setIsAddBrandModalOpen(false);
    setEditingBrand(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingBrand ? t.edit : t.addNewBrand}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddBrandModalOpen(false);
              setEditingBrand(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.brandName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mabelle Professional"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {t.category}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Hair Care, Skin Care"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1">
                {t.founded}
              </label>
              <input
                type="text"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="e.g. 2021"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.personality}
            </label>
            <input
              type="text"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. Elegant • Confident • Feminine"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.visualStyle}
            </label>
            <input
              type="text"
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="e.g. Luxury • Editorial • Refined"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.description}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short brand overview statement..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          {/* Color swatches */}
          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              {t.brandColors}
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 border border-white/10 text-neutral-300"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-[10px]">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-white/10"
              />
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-28 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-purple-600 transition-colors"
              >
                Add Color
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddBrandModalOpen(false);
                setEditingBrand(null);
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
