import React, { useState, useEffect } from 'react';
import { X, FileText, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { VisualAnalysis } from '../../types';

export const AnalysisModal: React.FC = () => {
  const {
    t,
    isAddAnalysisModalOpen,
    setIsAddAnalysisModalOpen,
    editingAnalysis,
    setEditingAnalysis,
    addAnalysis,
    updateAnalysis,
    brands,
    directions,
    activeBrandId,
    selectedDirectionId,
  } = useLibrary();

  const [title, setTitle] = useState('');
  const [targetBrandId, setTargetBrandId] = useState(activeBrandId);
  const [targetDirId, setTargetDirId] = useState('');
  const [visualStyle, setVisualStyle] = useState('');
  const [composition, setComposition] = useState('');
  const [camera, setCamera] = useState('');
  const [lensPerspective, setLensPerspective] = useState('');
  const [lighting, setLighting] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [environment, setEnvironment] = useState('');
  const [materials, setMaterials] = useState('');
  const [subject, setSubject] = useState('');
  const [styling, setStyling] = useState('');
  const [mood, setMood] = useState('');
  const [photography, setPhotography] = useState('');
  const [usefulElements, setUsefulElements] = useState('');
  const [avoid, setAvoid] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  const brandDirections = directions.filter((d) => d.brandId === targetBrandId);

  useEffect(() => {
    if (editingAnalysis) {
      setTitle(editingAnalysis.title);
      setTargetBrandId(editingAnalysis.brandId);
      setTargetDirId(editingAnalysis.directionId);
      setVisualStyle(editingAnalysis.visualStyle);
      setComposition(editingAnalysis.composition);
      setCamera(editingAnalysis.camera);
      setLensPerspective(editingAnalysis.lensPerspective);
      setLighting(editingAnalysis.lighting);
      setColorPalette(editingAnalysis.colorPalette);
      setEnvironment(editingAnalysis.environment);
      setMaterials(editingAnalysis.materials);
      setSubject(editingAnalysis.subject);
      setStyling(editingAnalysis.styling);
      setMood(editingAnalysis.mood);
      setPhotography(editingAnalysis.photography);
      setUsefulElements(editingAnalysis.usefulElements);
      setAvoid(editingAnalysis.avoid);
      setNotes(editingAnalysis.notes);
      setReferenceUrl(editingAnalysis.references?.join(', ') || '');
    } else {
      setTitle('');
      setTargetBrandId(activeBrandId);
      setTargetDirId(selectedDirectionId || (brandDirections[0]?.id || ''));
      setVisualStyle('');
      setComposition('');
      setCamera('');
      setLensPerspective('');
      setLighting('');
      setColorPalette('');
      setEnvironment('');
      setMaterials('');
      setSubject('');
      setStyling('');
      setMood('');
      setPhotography('');
      setUsefulElements('');
      setAvoid('');
      setNotes('');
      setReferenceUrl('');
    }
  }, [editingAnalysis, isAddAnalysisModalOpen, activeBrandId, selectedDirectionId]);

  if (!isAddAnalysisModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDirId) return;

    const urls = referenceUrl
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (editingAnalysis) {
      updateAnalysis(editingAnalysis.id, {
        title,
        brandId: targetBrandId,
        directionId: targetDirId,
        visualStyle,
        composition,
        camera,
        lensPerspective,
        lighting,
        colorPalette,
        environment,
        materials,
        subject,
        styling,
        mood,
        photography,
        usefulElements,
        avoid,
        notes,
        references: urls,
      });
    } else {
      addAnalysis({
        title,
        brandId: targetBrandId,
        directionId: targetDirId,
        visualStyle,
        composition,
        camera,
        lensPerspective,
        lighting,
        colorPalette,
        environment,
        materials,
        subject,
        styling,
        mood,
        photography,
        usefulElements,
        avoid,
        notes,
        references: urls,
        starred: false,
      });
    }

    setIsAddAnalysisModalOpen(false);
    setEditingAnalysis(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#13111e] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingAnalysis ? t.edit : t.addAnalysis}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAddAnalysisModalOpen(false);
              setEditingAnalysis(null);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {/* Target Brand & Direction */}
          <div className="grid grid-cols-2 gap-3">
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
                Target Direction
              </label>
              <select
                value={targetDirId}
                onChange={(e) => setTargetDirId(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
              >
                {brandDirections.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">
              Analysis Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 01 — Silk Hair Close-up with Golden Hour Light"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60 font-medium"
            />
          </div>

          {/* 14 Fields Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">{t.visualStyle}</label>
              <input
                type="text"
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.composition}</label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.camera}</label>
              <input
                type="text"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.lensPerspective}</label>
              <input
                type="text"
                value={lensPerspective}
                onChange={(e) => setLensPerspective(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.lighting}</label>
              <input
                type="text"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.colorPalette}</label>
              <input
                type="text"
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.subject}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.mood}</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.usefulElements}</label>
              <textarea
                rows={2}
                value={usefulElements}
                onChange={(e) => setUsefulElements(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">{t.avoid}</label>
              <textarea
                rows={2}
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">References (Image URLs, comma separated)</label>
            <input
              type="text"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddAnalysisModalOpen(false);
                setEditingAnalysis(null);
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
