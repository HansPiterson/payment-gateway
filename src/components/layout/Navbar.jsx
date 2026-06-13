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
      <nav className="navbar">
        {/* Brand */}
        <a href="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="navbar-brand-text">BAYAR.dev</span>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar-nav">
          {navTabs.map((tab) => (
            <li key={tab.key}>
              <a
                className={`navbar-nav-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
                role="button"
                tabIndex={0}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
          </button>

          <button className="navbar-icon-btn" aria-label="Notifications">
            <Notification02Icon size={18} />
            <span className="badge-dot" />
          </button>

          <button className="navbar-icon-btn" aria-label="Settings">
            <Settings02Icon size={18} />
          </button>

          <div className="navbar-user">
            <div className="navbar-avatar">AU</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">Admin User</span>
              <span className="navbar-user-email">admin@bayar.dev</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay open" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-panel open">
            <div className="mobile-nav-header">
              <span className="navbar-brand-text">BAYAR.dev</span>
              <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
                <Cancel01Icon size={18} />
              </button>
            </div>
            <ul className="mobile-nav-links">
              {navTabs.map((tab) => (
                <li key={tab.key}>
                  <a
                    className={activeTab === tab.key ? 'active' : ''}
                    onClick={() => handleTabClick(tab.key)}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
