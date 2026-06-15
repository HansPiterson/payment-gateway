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
        className={`fixed md:sticky top-0 left-0 bg-background/80 backdrop-blur-2xl border-border z-40 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch
          w-full h-16 border-b px-4 md:px-0 md:h-screen md:border-b-0 md:border-r 
          ${isCollapsed ? 'md:w-[5.5rem]' : 'md:w-[17rem]'}`}
      >
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-8 -right-3 w-6 h-6 bg-secondary border border-border text-muted-foreground hover:text-foreground rounded-full items-center justify-center cursor-pointer shadow-sm z-50 transition-ios"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ArrowRight01Icon size={12} /> : <ArrowLeft01Icon size={12} />}
        </button>

        {/* Brand / Logo */}
        <div className={`flex items-center gap-3 md:py-8 md:px-6 border-b-0 md:border-b md:border-border/50 md:h-24 ${isCollapsed ? 'md:justify-center md:px-0' : 'md:justify-start'}`}>
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-ios active:scale-95">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-[0_2px_8px_rgba(0,122,255,0.4)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className={`text-[19px] font-bold text-foreground tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-[15px] transition-ios group relative ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-[0_2px_8px_rgba(0,122,255,0.2)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 font-medium'
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                  title={isCollapsed ? tab.label : undefined}
                >
                  <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    <tab.Icon />
                  </span>
                  <span className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
                  >
                    {tab.label}
                  </span>

                  {/* Tooltip on Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 glass-panel text-foreground font-medium text-[13px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
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
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-ios active:scale-95"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-ios active:scale-95"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
          </button>
        </div>

        {/* Desktop User Profile & Theme Toggle (Bottom of Sidebar) */}
        <div className={`hidden md:flex flex-col gap-2 p-4 border-t border-border/50`}>
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[14px] font-medium transition-ios text-muted-foreground hover:text-foreground hover:bg-secondary/60 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
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

          <div className={`flex items-center gap-3 mt-2 ${isCollapsed ? 'justify-center' : 'justify-start px-2'}`}>
            <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-[11px] font-bold text-foreground flex-shrink-0 shadow-sm">
              AU
            </div>
            <div className={`flex flex-col text-left transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
            >
              <span className="text-[13px] font-bold text-foreground leading-tight">Admin</span>
              <span className="text-[11px] text-muted-foreground">{session?.user?.email || 'admin@bayar.dev'}</span>
            </div>
          </div>
          
          <button
            className={`flex items-center gap-3 px-3 py-2.5 mt-2 rounded-[14px] text-[14px] font-medium transition-ios text-destructive hover:bg-destructive/10 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 w-[17rem] h-full bg-background/90 backdrop-blur-2xl border-l border-border z-50 md:hidden flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] translate-x-0">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  ⚡
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">BAYAR.dev</span>
              </div>
              <button
                className="p-2 bg-secondary/80 text-muted-foreground hover:text-foreground rounded-full transition-ios active:scale-95"
                onClick={() => setMobileOpen(false)}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] transition-ios ${
                      activeTab === tab.key
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary font-medium'
                    }`}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    <span><tab.Icon /></span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-border/50 flex flex-col gap-4">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-ios text-muted-foreground hover:text-foreground hover:bg-secondary`}
                onClick={toggleTheme}
              >
                <span>{isDarkMode ? <Sun01Icon size={20} /> : <Moon01Icon size={20} />}</span>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium transition-ios text-destructive hover:bg-destructive/10`}
                onClick={handleLogout}
              >
                <span><Logout01Icon size={20} /></span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Floating Dock (iOS Style) */}
      <div className="fixed sm:hidden bottom-5 left-4 right-4 glass-panel rounded-[2rem] z-50 flex items-center justify-between px-3 py-2.5 ios-shadow">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center flex-1 gap-1 transition-ios active:scale-90 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {navTabs[0].Icon()}
          <span className="text-[10px] font-semibold tracking-wide">Dasbor</span>
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center flex-1 gap-1 transition-ios active:scale-90 ${activeTab === 'analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {navTabs[1].Icon()}
          <span className="text-[10px] font-semibold tracking-wide">Analitik</span>
        </button>

        <div className="flex-shrink-0 relative -top-6 mx-2">
          <button
            onClick={() => handleTabClick('payments')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-ios active:scale-[0.85] group`}
          >
            <div className={`w-[3.25rem] h-[3.25rem] rounded-full flex items-center justify-center shadow-lg border-4 border-background ${activeTab === 'payments' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'}`}>
              <PlusSignIcon size={24} className="stroke-[3px]" />
            </div>
            <span className={`text-[11px] font-bold whitespace-nowrap px-1 ${activeTab === 'payments' ? 'text-primary' : 'text-foreground group-hover:opacity-80'}`}>
              Tagih
            </span>
          </button>
        </div>

        <button
          onClick={() => handleTabClick('history')}
          className={`flex flex-col items-center flex-1 gap-1 transition-ios active:scale-90 ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Time02Icon size={18} strokeWidth={2.5} />
          <span className="text-[10px] font-semibold tracking-wide">Riwayat</span>
        </button>

        <button
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center flex-1 gap-1 transition-ios active:scale-90 ${activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {navTabs[3].Icon()}
          <span className="text-[10px] font-semibold tracking-wide">Setelan</span>
        </button>
      </div>
    </>
  );
}
