import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Camera,
  Lightbulb,
  Image as ImageIcon,
  Package,
  Star,
  Clock,
  Trash2,
  Globe,
  HardDriveDownload,
  ChevronRight,
  Plus,
  Database,
  X,
  Cloud,
  CloudOff,
  Loader2,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { ActiveNavSection } from '../types';

export const Sidebar: React.FC = () => {
  const {
    t,
    lang,
    setLang,
    activeNav,
    setActiveNav,
    brands,
    setIsAddBrandModalOpen,
    setIsBackupModalOpen,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
    supabaseStatus,
    isSidebarOpen,
    setIsSidebarOpen,
    cloudSyncState,
  } = useLibrary();

  const mainNavItems: { id: ActiveNavSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'brands',
      label: t.brands,
      icon: <Building2 className="w-4 h-4" />,
      badge: brands.length,
    },
    {
      id: 'promptLibrary',
      label: t.promptLibrary,
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'cameraAngles',
      label: t.cameraAngles,
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: 'creativeReferences',
      label: t.creativeReferences,
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'allReferences',
      label: t.allReferences,
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'products',
      label: t.products,
      icon: <Package className="w-4 h-4" />,
    },
  ];

  const favoritesNavItems: { id: ActiveNavSection; label: string; icon: React.ReactNode }[] = [
    {
      id: 'starred',
      label: t.starred,
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: 'recentlyUsed',
      label: t.recentlyUsed,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'trash',
      label: t.trash,
      icon: <Trash2 className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={`w-72 sm:w-64 flex-shrink-0 bg-[#0A0A0A] border-e border-[#1F1F1F] flex flex-col justify-between h-[100dvh] select-none z-50
        fixed inset-y-0 start-0 transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}
        lg:sticky lg:top-0 lg:translate-x-0 lg:z-30`}
      aria-label={t.menu}
    >
      {/* Top Header & Logo */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3 px-1 mb-6">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 end-4 p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5"
            aria-label={t.closeMenu}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] flex-shrink-0">
            <span className="font-bold text-white text-xs tracking-wider">CVL</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold tracking-wider text-white flex items-center gap-1.5">
              Visual Library
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-bold">
              WORKSPACE
            </span>
          </div>
        </div>

        {/* Dashboard prominent button */}
        <button
          onClick={() => setActiveNav('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
            activeNav === 'dashboard'
              ? 'bg-violet-600/10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-violet-500 text-white'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <span className={activeNav === 'dashboard' ? 'text-violet-400' : 'text-[#52525B]'}>
            ◈
          </span>
          <LayoutDashboard className={`w-4 h-4 ${activeNav === 'dashboard' ? 'text-violet-400' : 'text-[#A1A1AA]'}`} />
          <span>{t.dashboard}</span>
        </button>
      </div>

      {/* Nav menus */}
      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-6">
        {/* Main section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-bold">
              {t.mainMenu}
            </span>
            <button
              onClick={() => setIsAddBrandModalOpen(true)}
              className="text-[#52525B] hover:text-violet-400 p-0.5 rounded transition-colors"
              title={t.addNewBrand}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {mainNavItems.slice(1).map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-violet-600/10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-violet-500 text-white'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-violet-400' : 'text-[#52525B]'}>
                      {isActive ? '◈' : '◇'}
                    </span>
                    <span className={isActive ? 'text-violet-400' : 'text-[#A1A1AA]'}>
                      {item.icon}
                    </span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2D2D2D] text-[#A1A1AA] font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorites Section */}
        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-bold">
              {t.favoritesMenu}
            </span>
          </div>
          <div className="space-y-1">
            {favoritesNavItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-violet-600/10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-violet-500 text-white'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-violet-400' : 'text-[#52525B]'}>
                      {isActive ? '◈' : '◇'}
                    </span>
                    <span className={isActive ? 'text-violet-400' : 'text-[#A1A1AA]'}>
                      {item.icon}
                    </span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Area: Language, Promo/Backup, Profile */}
      <div className="p-4 pt-3 border-t border-[#1F1F1F] space-y-3">
        {/* Language switch */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#111111] border border-[#1F1F1F]">
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
            <Globe className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-bold text-[#52525B] tracking-wider uppercase">EN / AR</span>
          </div>
          <div className="flex items-center gap-1 bg-[#1A1A1A] p-0.5 rounded-full text-[11px] border border-[#2D2D2D]">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full font-medium text-[10px] transition-colors ${
                lang === 'en'
                  ? 'bg-violet-600 text-white font-bold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-2 py-0.5 rounded-full font-medium text-[10px] transition-colors ${
                lang === 'ar'
                  ? 'bg-violet-600 text-white font-bold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              AR
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#111111] border border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#2D2D2D] flex items-center justify-center text-violet-400 font-semibold text-xs">
              CD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">{t.profileRole}</span>
              <span className="text-[10px] text-violet-400/80">{t.profilePlan}</span>
            </div>
          </div>
        </div>

        {/* Supabase Cloud Connection Button */}
        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#111111] hover:bg-[#161616] border border-[#1F1F1F] hover:border-emerald-500/40 text-xs text-[#A1A1AA] hover:text-white transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white text-[11px]">{t.supabaseDatabase || 'Supabase Database'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {cloudSyncState === 'syncing' ? (
              <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />
            ) : cloudSyncState === 'synced' ? (
              <Cloud className="w-3 h-3 text-emerald-400" />
            ) : (
              <CloudOff className="w-3 h-3 text-[#52525B]" />
            )}
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured
                  ? supabaseStatus?.tableExists
                    ? 'bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                    : 'bg-amber-500'
                  : 'bg-[#52525B]'
              }`}
            />
          </div>
        </button>

        {/* Vault Card */}
        <div className="p-3 rounded-xl bg-[#111111] border border-[#1F1F1F] relative overflow-hidden group hover:border-violet-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-white">
            <HardDriveDownload className="w-3.5 h-3.5 text-violet-400" />
            <span>{t.unlockFullPower}</span>
          </div>
          <p className="text-[10px] text-[#A1A1AA] mb-2 leading-relaxed">
            {t.unlockDesc}
          </p>
          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="w-full py-1.5 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          >
            <span>{t.backupButton}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
