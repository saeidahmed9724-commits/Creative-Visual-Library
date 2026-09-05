import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { ImageUploadField } from '../ImageUploadField';

export const ProductModal: React.FC = () => {
  const {
    t,
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    brands,
    activeBrandId,
  } = useLibrary();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Shampoo');
  const [targetBrandId, setTargetBrandId] = useState(activeBrandId);
  const [mainImage, setMainImage] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setTargetBrandId(editingProduct.brandId);
      setMainImage(editingProduct.mainImage);
      setDescription(editingProduct.description);
      setNotes(editingProduct.notes || '');
    } else {
      setName('');
      setCategory('Hair Care');
      setTargetBrandId(activeBrandId);
      setMainImage(
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
      );
      setDescription('');
      setNotes('');
    }
  }, [editingProduct, isAddProductModalOpen, activeBrandId]);

  if (!isAddProductModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        brandId: targetBrandId,
        name,
        category,
        mainImage,
        description,
        notes,
      });
    } else {
      addProduct({
        brandId: targetBrandId,
        name,
        category,
        mainImage,
        description,
        notes,
      });
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingProduct ? t.edit : t.addProduct}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddProductModalOpen(false);
              setEditingProduct(null);
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
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Microplastia Shampoo"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Hair Care, Skin Serum"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <ImageUploadField
            label="Product Image"
            value={mainImage}
            onChange={setMainImage}
            folder="products"
            idHint={editingProduct?.id}
            previewAspectClassName="aspect-square w-20 h-20"
          />

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Packaging finish, bottle specs, formula..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Creative Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Always position cap facing forward with soft rim reflection"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddProductModalOpen(false);
                setEditingProduct(null);
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
