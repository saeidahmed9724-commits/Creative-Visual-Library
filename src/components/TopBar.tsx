import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  ChevronDown,
  Sparkles,
  Building2,
  Compass,
  FileText,
  Camera,
  Package,
  Lightbulb,
  FileUp,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export const TopBar: React.FC = () => {
  const {
    t,
    theme,
    toggleTheme,
    setIsCommandSearchOpen,
    setIsImportModalOpen,
    setIsAddBrandModalOpen,
    setIsAddDirectionModalOpen,
    setIsAddAnalysisModalOpen,
    setIsAddPromptModalOpen,
    setIsAddAngleModalOpen,
    setIsAddProductModalOpen,
    setIsAddCreativeRefModalOpen,
    brands,
    activeBrandId,
    setActiveBrandId,
  } = useLibrary();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isBrandSelectOpen, setIsBrandSelectOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const brandMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (brandMenuRef.current && !brandMenuRef.current.contains(e.target as Node)) {
        setIsBrandSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandSearchOpen]);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-[#1F1F1F] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Left: Search input & Brand Quick Select */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Universal Search trigger button */}
        <button
          onClick={() => setIsCommandSearchOpen(true)}
          className="flex-1 flex items-center justify-between px-4 py-1.5 rounded-full bg-[#111111] hover:bg-[#161616] border border-[#1F1F1F] text-[#52525B] hover:text-[#A1A1AA] transition-all text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-[#52525B] group-hover:text-violet-400 transition-colors" />
            <span className="text-xs text-[#52525B] group-hover:text-[#A1A1AA]">{t.searchPlaceholder}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#52525B] bg-[#1A1A1A] border border-[#2D2D2D] rounded-full">
            {t.pressToSearch}
          </kbd>
        </button>

        {/* Brand Switcher Pill */}
        {activeBrand && (
          <div className="relative" ref={brandMenuRef}>
            <button
              onClick={() => setIsBrandSelectOpen(!isBrandSelectOpen)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F1F1F] text-xs font-medium text-[#A1A1AA] hover:text-white transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-violet-400" />
              <span className="truncate max-w-[130px]">{activeBrand.name}</span>
              <ChevronDown className="w-3 h-3 text-[#52525B]" />
            </button>

            {isBrandSelectOpen && (
              <div className="absolute left-0 mt-1.5 w-52 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#52525B] tracking-wider">
                  {t.brands}
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBrandId(b.id);
                      setIsBrandSelectOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      b.id === activeBrandId
                        ? 'bg-violet-600/20 text-white font-medium border border-violet-500/40'
                        : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    <div className="flex items-center gap-1">
                      {b.brandColors.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#1F1F1F] transition-all"
          title={t.toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon with dot */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#1F1F1F] transition-all"
            title={t.notifications}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
          </button>
        </div>

        {/* Glowing + Add New Dropdown Button */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="uppercase tracking-wider">{t.addNew}</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              {/* Highlighted Import ChatGPT item */}
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  setIsImportModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-600/15 text-white hover:bg-violet-600/25 border border-violet-500/30 mb-2 transition-all text-xs font-medium group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="font-semibold text-white">{t.importAnalysis}</span>
                  <span className="text-[10px] text-[#A1A1AA]">Paste ChatGPT text parser</span>
                </div>
              </button>

              <div className="h-px bg-[#1F1F1F] my-1" />

              <div className="space-y-0.5 text-xs text-[#A1A1AA]">
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddAnalysisModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t.addAnalysis}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddDirectionModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t.addVisualDirection}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddBrandModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t.addNewBrand}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddPromptModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.addNewPrompt}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddAngleModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.addNewAngle}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddProductModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.addProduct}</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    setIsAddCreativeRefModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{t.addNewCreativeRef}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle from Design */}
        <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#2D2D2D] flex items-center justify-center text-xs text-white font-bold">
          CD
        </div>
      </div>
    </header>
  );
};
