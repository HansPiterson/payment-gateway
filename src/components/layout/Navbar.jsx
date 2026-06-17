import { useState } from 'react';
import {
  Notification02Icon,
  Settings02Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Sun01Icon,
  Moon01Icon,
  Time02Icon,
  PlusSignIcon,
  Logout01Icon,
} from 'hugeicons-react';
import { supabase } from '../../lib/supabase';

const navTabs = [
  { 
    label: 'Dashboard', 
    key: 'dashboard',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    )
  },
  { 
    label: 'Analytics', 
    key: 'analytics',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  { 
    label: 'Payments', 
    key: 'payments',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  { 
    label: 'Donasi', 
    key: 'donations',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  },
  { 
    label: 'Withdraw', 
    key: 'withdraw',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  { 
    label: 'Settings', 
    key: 'settings',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
];

export default function Navbar({ activeTab = 'dashboard', onTabChange, isDarkMode, toggleTheme, session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleTabClick = (key) => {
    onTabChange?.(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Sidebar for Desktop / Header for Mobile */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bg-zinc-900 border-zinc-800 z-40 transition-all duration-300 ease-in-out flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch
          w-full h-16 border-b px-4 md:px-0 md:h-screen md:border-b-0 md:border-r 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-8 -right-3 w-6 h-6 bg-zinc-850 border border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-full items-center justify-center cursor-pointer shadow-md z-50 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ArrowRight01Icon size={12} /> : <ArrowLeft01Icon size={12} />}
        </button>

        {/* Brand / Logo */}
        <div className={`flex items-center gap-3 md:py-8 md:px-5 border-b-0 md:border-b md:border-border md:h-24 ${isCollapsed ? 'md:justify-center' : 'md:justify-start'}`}>
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 flex-shrink-0">
              <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className={`text-lg font-bold text-zinc-100 tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0 hidden md:block' : 'w-auto opacity-100'}`}
            >
              BAYAR.dev
            </span>
          </a>
        </div>

        {/* Desktop Vertical Menu */}
        <ul className="hidden md:flex flex-col gap-1.5 p-4 flex-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <li key={tab.key}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-150 hover:bg-zinc-850/50'
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                  title={isCollapsed ? tab.label : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    <tab.Icon />
                  </span>
                  <span className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
                  >
                    {tab.label}
                  </span>

                  {/* Tooltip on Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                      {tab.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Actions / Hamburger (Tablet Only) */}
        <div className="hidden sm:flex md:hidden items-center gap-2">
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}
          </button>
          <button
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
          </button>
        </div>

        {/* Desktop User Profile & Theme Toggle (Bottom of Sidebar) */}
        <div className={`hidden md:flex flex-col gap-2 p-4 border-t border-zinc-850/50`}>
          <button
            className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all text-zinc-400 hover:text-zinc-150 hover:bg-zinc-850/50 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            onClick={toggleTheme}
            title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            <span className="flex-shrink-0">
              {isDarkMode ? <Sun01Icon size={18} /> : <Moon01Icon size={18} />}
            </span>
            <span className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <div className={`flex items-center gap-3 mt-2 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200 flex-shrink-0">
              AU
            </div>
            <div className={`flex flex-col text-left transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
            >
              <span className="text-xs font-semibold text-zinc-200 leading-tight">Admin Dashboard</span>
              <span className="text-[10px] text-zinc-500">{session?.user?.email || 'admin@bayar.dev'}</span>
            </div>
          </div>
          
          <button
            className={`flex items-center gap-3 px-2 py-2 mt-1 rounded-lg text-sm font-medium transition-all text-red-400 hover:text-red-300 hover:bg-red-950/30 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <span className="flex-shrink-0">
              <Logout01Icon size={18} />
            </span>
            <span className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Tablet Nav Drawer (Slides from Right with Smooth Animation) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-zinc-900 border-l border-zinc-800 z-50 md:hidden flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold">
                  <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-4 h-4 object-contain" />
                </div>
                <span className="text-lg font-bold text-zinc-100">BAYAR.dev</span>
              </div>
              <button
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-zinc-100 text-zinc-950 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850'
                    }`}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    <span><tab.Icon /></span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-zinc-850/50 flex flex-col gap-4">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-muted`}
                onClick={toggleTheme}
              >
                <span>{isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}</span>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
                  AU
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-200 leading-tight">Admin Dashboard</span>
                  <span className="text-[10px] text-zinc-500">{session?.user?.email || 'admin@bayar.dev'}</span>
                </div>
              </div>

              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-red-400 hover:text-red-300 hover:bg-red-950/30`}
                onClick={handleLogout}
              >
                <span><Logout01Icon size={20} /></span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Dock (Slides up from bottom, visible only < sm) */}
      <div className="fixed sm:hidden bottom-0 left-0 w-full bg-card border-t border-border z-50 flex items-center justify-between px-2 pt-2 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          {navTabs[0].Icon()}
          <span className="text-[9px] font-medium tracking-wide">Dashboard</span>
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'analytics' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          {navTabs[1].Icon()}
          <span className="text-[9px] font-medium tracking-wide">Analytic</span>
        </button>

        <div className="flex-shrink-0 relative -top-6 mx-1">
          <button
            onClick={() => handleTabClick('payments')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95 group`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-[6px] border-zinc-950 ${activeTab === 'payments' ? 'bg-zinc-200 text-zinc-950' : 'bg-zinc-100 text-zinc-900'}`}>
              <PlusSignIcon size={24} className="stroke-[3px]" />
            </div>
            <span className={`text-[10px] font-bold whitespace-nowrap px-1 ${activeTab === 'payments' ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
              Buat Link
            </span>
          </button>
        </div>

        <button
          onClick={() => handleTabClick('history')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'history' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Time02Icon size={18} strokeWidth={2.5} />
          <span className="text-[9px] font-medium tracking-wide">Riwayat</span>
        </button>

        <button
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'settings' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          {navTabs[3].Icon()}
          <span className="text-[9px] font-medium tracking-wide">Settings</span>
        </button>
      </div>
    </>
  );
}
