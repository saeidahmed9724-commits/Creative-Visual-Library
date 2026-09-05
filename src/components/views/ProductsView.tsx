import React from 'react';
import {
  Plus,
  Edit,
  Trash2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const ProductsView: React.FC = () => {
  const {
    t,
    products,
    activeBrand,
    setIsAddProductModalOpen,
    setEditingProduct,
    deleteProduct } = useLibrary();

  const brandProducts = products.filter(
    (p) => !activeBrand || p.brandId === activeBrand.id
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.products}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
              {brandProducts.length} Products
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Product lines, packaging references, and SKU descriptions for {activeBrand?.name}.
          </p>
        </div>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProduct}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {brandProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-[#12111a] border border-white/5 hover:border-purple-500/30 p-3 flex flex-col justify-between transition-all group hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-3">
                <img
                  src={prod.mainImage || undefined}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 text-purple-300 backdrop-blur-md border border-purple-500/20">
                  {prod.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>
                {prod.notes && (
                  <p className="text-[11px] text-purple-300/80 italic line-clamp-1 pt-1">
                    {prod.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  setEditingProduct(prod);
                  setIsAddProductModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteProduct(prod.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Product Card */}
        <div
          onClick={() => setIsAddProductModalOpen(true)}
          className="rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-400/40 hover:bg-purple-950/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-3 border border-purple-500/30">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
            {t.addProduct}
          </span>
          <span className="text-xs text-neutral-500 mt-1">
            Register a new bottle or treatment
          </span>
        </div>
      </div>
    </div>
  );
};
