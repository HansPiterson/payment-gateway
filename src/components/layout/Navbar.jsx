import { useState } from 'react';
import {
  Notification02Icon,
  Settings02Icon,
  Menu01Icon,
  Cancel01Icon,
} from 'hugeicons-react';

const navTabs = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Analytics', key: 'analytics' },
  { label: 'Payments', key: 'payments' },
  { label: 'Settings', key: 'settings' },
];

export default function Navbar({ activeTab = 'dashboard', onTabChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (key) => {
    onTabChange?.(key);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="w-full h-16 bg-zinc-900 border-b border-zinc-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-tight">BAYAR.dev</span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-2">
          {navTabs.map((tab) => (
            <li key={tab.key}>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }`}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
          </button>

          <button className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" aria-label="Notifications">
            <Notification02Icon size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-zinc-400 rounded-full" />
          </button>

          <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" aria-label="Settings">
            <Settings02Icon size={18} />
          </button>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
              AU
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-200 leading-tight">Admin User</span>
              <span className="text-[10px] text-zinc-500">admin@bayar.dev</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-zinc-900 border-l border-zinc-800 z-50 md:hidden flex flex-col p-6 shadow-2xl transition-transform animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-zinc-100">BAYAR.dev</span>
              <button
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
