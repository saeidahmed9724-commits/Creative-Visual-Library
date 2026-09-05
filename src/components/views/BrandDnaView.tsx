import React, { useState } from 'react';
import {
  Sparkles,
  Edit3,
  Check,
  X,
  Camera,
  Layers,
  Palette,
  Type,
  ShieldAlert,
  FileText } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { BrandCore } from '../../types';

export const BrandDnaView: React.FC = () => {
  const { t, activeBrand, updateBrand } = useLibrary();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BrandCore>(
    activeBrand?.brandCore || {
      personality: '',
      positioning: '',
      generalVisualIdentity: '',
      generalColors: '',
      typography: '',
      materials: '',
      generalPhotographyPrinciples: '',
      thingsToAvoid: '',
      notes: '',
    }
  );

  if (!activeBrand) return null;

  const handleSave = () => {
    updateBrand(activeBrand.id, { brandCore: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(activeBrand.brandCore);
    setIsEditing(false);
  };

  const coreCards = [
    {
      key: 'personality',
      title: t.personality,
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      value: formData.personality,
      placeholder: 'E.g., Sophisticated, empowering, luxury salon excellence...',
    },
    {
      key: 'positioning',
      title: t.brandPositioning,
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      value: formData.positioning,
      placeholder: 'E.g., High-end prestige hair treatments bridging haute couture...',
    },
    {
      key: 'generalVisualIdentity',
      title: t.generalVisualIdentity,
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      value: formData.generalVisualIdentity,
      placeholder: 'E.g., Generous negative space, soft purple and obsidian tones...',
    },
    {
      key: 'generalColors',
      title: t.generalColors,
      icon: <Palette className="w-4 h-4 text-rose-400" />,
      value: formData.generalColors,
      placeholder: 'E.g., Deep plum, muted orchid, champagne ivory...',
    },
    {
      key: 'typography',
      title: t.typography,
      icon: <Type className="w-4 h-4 text-cyan-400" />,
      value: formData.typography,
      placeholder: 'E.g., Primary display serif with geometric sans body...',
    },
    {
      key: 'materials',
      title: t.materials,
      icon: <Layers className="w-4 h-4 text-teal-400" />,
      value: formData.materials,
      placeholder: 'E.g., Frosted purple glass, brushed gold aluminum caps...',
    },
    {
      key: 'generalPhotographyPrinciples',
      title: t.generalPhotographyPrinciples,
      icon: <Camera className="w-4 h-4 text-amber-400" />,
      value: formData.generalPhotographyPrinciples,
      placeholder: 'E.g., Shallow depth of field, directional soft key light...',
    },
    {
      key: 'thingsToAvoid',
      title: t.avoid,
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
      value: formData.thingsToAvoid,
      placeholder: 'E.g., Harsh neon clashing colors, overcrowded arrays, flat flash...',
    },
    {
      key: 'notes',
      title: t.notes,
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      value: formData.notes,
      placeholder: 'Additional guidelines, aspect ratio rules, digital requirements...',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.brandDna}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-900/30 text-violet-400 border border-violet-500/30 font-bold uppercase tracking-wider text-[10px]">
              Core Identity
            </span>
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Fundamental design principles, positioning, and photography rules for {activeBrand.name}.
          </p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F1F1F] text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.cancel}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111111] hover:bg-violet-600/20 text-[#A1A1AA] hover:text-white border border-[#1F1F1F] hover:border-violet-500/40 text-xs font-medium transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-violet-400" />
            <span>{t.edit}</span>
          </button>
        )}
      </div>

      {/* Grid of 9 Core Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreCards.map((card) => (
          <div
            key={card.key}
            className="p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-violet-500/40 transition-all flex flex-col justify-between hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white tracking-wide">
                <div className="p-1 rounded-md bg-[#1A1A1A] border border-[#2D2D2D]">{card.icon}</div>
                <span>{card.title}</span>
              </div>

              {isEditing ? (
                <textarea
                  rows={4}
                  value={card.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [card.key]: e.target.value,
                    })
                  }
                  placeholder={card.placeholder}
                  className="w-full text-xs bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-2.5 text-[#E0E0E0] placeholder-[#52525B] focus:outline-none focus:border-violet-500/50 resize-none"
                />
              ) : (
                <p className="text-xs text-[#A1A1AA] leading-relaxed min-h-[60px] whitespace-pre-line">
                  {card.value || (
                    <span className="text-[#52525B] italic">Not set</span>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
