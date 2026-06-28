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
import { Drawer } from 'vaul';

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
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const handleCreateOption = (type) => {
    if (type === 'donations') {
       window.history.pushState({}, '', '/donate/create-new');
       onTabChange?.('create-campaign');
    } else {
       onTabChange?.('payments');
    }
    setIsCreateDrawerOpen(false);
  };

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
        className={`fixed md:sticky top-0 left-0 bg-white/80 dark:bg-zinc-950/80 border-zinc-200/50 dark:border-zinc-900/50 md:bg-zinc-50 dark:md:bg-zinc-900 md:border-zinc-200 dark:md:border-zinc-800 backdrop-blur-md md:backdrop-blur-none z-40 transition-all duration-300 ease-in-out flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch
          w-full h-16 border-b px-4 md:px-0 md:h-screen md:border-b-0 md:border-r 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-8 -right-3 w-6 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-full items-center justify-center cursor-pointer shadow-md z-50 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ArrowRight01Icon size={12} /> : <ArrowLeft01Icon size={12} />}
        </button>

        {/* Brand / Logo */}
        <div className={`flex items-center gap-3 md:py-8 md:px-5 border-b-0 md:border-b md:border-zinc-200 dark:md:border-zinc-800 md:h-24 ${isCollapsed ? 'md:justify-center' : 'md:justify-start'}`}>
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-950 flex-shrink-0">
              <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className={`text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
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
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                  title={isCollapsed ? tab.label : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                    <tab.Icon />
                  </span>
                  <span className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
                  >
                    {tab.label}
                  </span>

                  {/* Tooltip on Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
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
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}
          </button>
          <button
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
          </button>
        </div>

        {/* Desktop User Profile & Theme Toggle (Bottom of Sidebar) */}
        <div className={`hidden md:flex flex-col gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800/50`}>
          <button
            className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-150 dark:hover:bg-zinc-800/50 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
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
            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200 flex-shrink-0">
              AU
            </div>
            <div className={`flex flex-col text-left transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
            >
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">Admin Dashboard</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{session?.user?.email || 'admin@bayar.dev'}</span>
            </div>
          </div>
          
          <button
            className={`flex items-center gap-3 px-2 py-2 mt-1 rounded-lg text-sm font-medium transition-all text-red-650 hover:text-red-700 hover:bg-red-50/50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
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
          <div className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-50 md:hidden flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-950 font-bold">
                  <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-4 h-4 object-contain" />
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">BAYAR.dev</span>
              </div>
              <button
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-850 rounded-lg transition-colors"
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
                        ? 'bg-zinc-900 text-white dark:bg-zinc-105 dark:text-zinc-950 font-semibold shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-850'
                    }`}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    <span><tab.Icon /></span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col gap-4">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50`}
                onClick={toggleTheme}
              >
                <span>{isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}</span>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  AU
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">Admin Dashboard</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{session?.user?.email || 'admin@bayar.dev'}</span>
                </div>
              </div>

              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-red-650 hover:text-red-700 hover:bg-red-50/50 dark:text-red-450 dark:hover:text-red-350 dark:hover:bg-red-950/30`}
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
      <div className="fixed sm:hidden bottom-0 left-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200/50 dark:border-zinc-900/50 z-[55] flex items-center justify-between px-2 pt-2 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          {navTabs[0].Icon()}
          <span className="text-[9px] font-semibold tracking-wide">Dashboard</span>
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'analytics' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          {navTabs[1].Icon()}
          <span className="text-[9px] font-semibold tracking-wide">Analytic</span>
        </button>

        <div className="flex-shrink-0 relative -top-6 mx-1">
          <button
            onClick={() => setIsCreateDrawerOpen(true)}
            className={`flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95 group`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[6px] border-white dark:border-zinc-950 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950`}>
              <PlusSignIcon size={24} className="stroke-[3px]" />
            </div>
            <span className={`text-[10px] font-bold whitespace-nowrap px-1 ${activeTab === 'payments' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              Buat Link
            </span>
          </button>
        </div>

        <button
          onClick={() => handleTabClick('history')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'history' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          <Time02Icon size={18} strokeWidth={2.5} />
          <span className="text-[9px] font-semibold tracking-wide">Riwayat</span>
        </button>

        <button
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center flex-1 gap-1 transition-colors ${activeTab === 'settings' ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          {navTabs.find(t => t.key === 'settings').Icon()}
          <span className="text-[9px] font-semibold tracking-wide">Settings</span>
        </button>
      </div>

      {/* Mobile Create Link Drawer (vaul) */}
      <Drawer.Root open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] sm:hidden" />
          <Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col rounded-t-[20px] h-auto fixed bottom-0 left-0 right-0 z-[70] sm:hidden border-t border-zinc-200 dark:border-zinc-800">
            <div className="p-6 pb-12 bg-white dark:bg-zinc-900 rounded-t-[20px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-6" />
              <Drawer.Title className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 px-2">Buat Link Baru</Drawer.Title>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleCreateOption('payments')}
                  className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-2xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <PlusSignIcon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Buat Link Pembayaran</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Terima pembayaran QRIS instan</div>
                    </div>
                  </div>
                  <ArrowRight01Icon size={16} className="text-zinc-400 dark:text-zinc-500" />
                </button>
                
                <button
                  onClick={() => handleCreateOption('donations')}
                  className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-2xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Buat Link Donasi</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Galang dana dengan kampanye</div>
                    </div>
                  </div>
                  <ArrowRight01Icon size={16} className="text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
