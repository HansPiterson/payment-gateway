import { useState, useEffect, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import PageHeader from './components/layout/PageHeader';
import StatsCards from './components/dashboard/StatsCards';
import PerformanceChart from './components/dashboard/PerformanceChart';
import SalesOverview from './components/dashboard/SalesOverview';
import RecentOrders from './components/dashboard/RecentOrders';
import { FUNCTIONS_URL, supabaseAnonKey } from './lib/supabase';

import PaymentLinkGenerator from './components/PaymentLinkGenerator';
import DirectPayView from './components/DirectPayView';
import Login from './components/Login';
import CampaignsList from './components/dashboard/CampaignsList';
import CreateCampaign from './components/dashboard/CreateCampaign';
import CampaignDetails from './components/dashboard/CampaignDetails';
import DonationStatsCard from './components/dashboard/DonationStatsCard';
import DonateView from './components/DonateView';
import DonateEndedView from './components/DonateEndedView';
import NotFound from './components/NotFound';
import WithdrawView from './components/WithdrawView';
import { supabase } from './lib/supabase';
import { Toaster } from './components/ui/Toaster';


const DashboardSkeleton = () => (
  <div className="w-full flex-grow flex flex-col space-y-6 md:space-y-8 animate-pulse text-muted-foreground">
    {/* PageHeader Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div className="space-y-2 text-left">
        <div className="h-7 w-48 bg-card border border-border rounded-lg" />
        <div className="h-4 w-72 bg-card border border-border rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-28 bg-card border border-border rounded-lg" />
        <div className="h-9 w-24 bg-card border border-border rounded-lg" />
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="w-7 h-7 bg-muted rounded-lg" />
          </div>
          <div className="h-8 w-28 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>

    {/* API summary skeleton */}
    <div className="space-y-3 text-left w-full">
      <div className="h-4 w-40 bg-card border border-border rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="h-3.5 w-16 bg-muted rounded" />
            <div className="h-5 w-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* RecentOrders Table Skeleton */}
    <div className="bg-card border border-border rounded-xl py-6 space-y-4 flex-1">
      <div className="flex justify-between items-center px-6">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-8 w-44 bg-muted rounded-lg" />
      </div>
      <div className="h-px bg-border" />
      <div className="px-6 space-y-3.5 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-3.5 w-28 bg-muted rounded" />
                <div className="h-2 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="h-3.5 w-16 bg-muted rounded hidden sm:block" />
            <div className="h-3.5 w-20 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted/80 rounded-full" />
            <div className="h-3.5 w-16 bg-muted rounded text-right" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsSkeleton = () => (
  <div className="w-full flex-grow flex flex-col space-y-6 md:space-y-8 animate-pulse text-muted-foreground">
    {/* PageHeader Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div className="space-y-2 text-left">
        <div className="h-7 w-48 bg-card border border-border rounded-lg" />
        <div className="h-4 w-72 bg-card border border-border rounded-lg" />
      </div>
      <div className="h-9 w-24 bg-card border border-border rounded-lg" />
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 h-[380px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded-lg" />
        </div>
        <div className="flex items-end gap-3 h-52 mt-4 px-2">
          {[40, 25, 65, 35, 85, 55, 75, 60].map((h, i) => (
            <div key={i} className="bg-muted rounded-t-lg flex-1" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 h-[380px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="w-5 h-5 bg-muted rounded-full" />
        </div>
        <div className="relative w-36 h-36 rounded-full border-8 border-muted border-t-card-foreground animate-spin mx-auto my-6 flex items-center justify-center">
          <div className="h-4 w-12 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-2 text-left">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-5 w-12 bg-muted rounded" />
          </div>
          <div className="space-y-2 pl-4 border-l border-border text-left">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-5 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [payInvoiceId, setPayInvoiceId] = useState(null);
  const [donateCampaignId, setDonateCampaignId] = useState(null);
  const [adminCampaignId, setAdminCampaignId] = useState(null);
  
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // default to dark mode for this app
      return true;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/pay/')) {
      const id = path.replace('/pay/', '');
      if (id) {
        setPayInvoiceId(id);
        setActiveTab('pay-invoice');
      }
    } else if (path.startsWith('/donate/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts[1] === 'create-new') {
        setActiveTab('create-campaign');
      } else if (parts[1] === 'end' && parts[2]) {
        setDonateCampaignId(parts[2]);
        setActiveTab('donate-ended');
      } else if (parts[1]) {
        setDonateCampaignId(parts[1]);
        setActiveTab('donate-public');
      }
    } else if (path !== '/' && path !== '') {
      setActiveTab('not-found');
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'analytics' || activeTab === 'withdraw') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${FUNCTIONS_URL}/get-dashboard-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server.');
      }

      const res = await response.json();
      if (res.success) {
        setDashboardData(res.data);
      } else {
        throw new Error(res.error || 'Gagal memuat dashboard.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show auth loading state briefly
  if (authLoading && activeTab !== 'pay-invoice' && activeTab !== 'donate-public' && activeTab !== 'donate-ended' && activeTab !== 'not-found') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-800 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  // Require login for dashboard routes
  if (!session && activeTab !== 'pay-invoice' && activeTab !== 'donate-public' && activeTab !== 'donate-ended' && activeTab !== 'not-found') {
    return <Login />;
  }

  if (activeTab === 'not-found') {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      {activeTab !== 'pay-invoice' && activeTab !== 'donate-public' && activeTab !== 'donate-ended' && (
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          session={session}
        />
      )}

      {/* Main Page Content Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 ${(activeTab === 'pay-invoice' || activeTab === 'donate-public' || activeTab === 'donate-ended') ? 'p-0' : 'pt-16 md:pt-0'} overflow-x-hidden`}>
        {activeTab === 'dashboard' && (
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-8 flex flex-col">
            {loading ? (
              <DashboardSkeleton />
            ) : error ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 text-center max-w-sm w-full shadow-lg">
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">Terjadi Kesalahan</h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{error}</p>
                  <button
                    onClick={fetchDashboardData}
                    className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-xs shadow-sm"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            ) : dashboardData ? (
              <>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <PageHeader 
                    onRefresh={fetchDashboardData} 
                    isLoading={loading} 
                    onWithdraw={() => setActiveTab('withdraw')}
                  />
                </div>
                <div className="space-y-6 md:space-y-8 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <StatsCards stats={dashboardData.stats} onBalanceClick={() => setActiveTab('withdraw')} />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <DonationStatsCard onClick={() => setActiveTab('donations')} />
                    </div>
                    <div className="lg:col-span-2">
                      <div className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-full">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                          Pemantauan API Bayar.gg
                        </span>
                        <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
                          <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 flex flex-col justify-center text-left">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Transaksi</span>
                            <span className="text-lg font-black text-zinc-150 mt-1">
                              {dashboardData.apiSummary?.totalPayments ?? 0}
                            </span>
                          </div>
                          <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 flex flex-col justify-center text-left">
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Sukses</span>
                            <span className="text-lg font-black text-green-400 mt-1">
                              {dashboardData.apiSummary?.paid ?? 0}
                            </span>
                          </div>
                          <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 flex flex-col justify-center text-left">
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Pending</span>
                            <span className="text-lg font-black text-yellow-400 mt-1">
                              {dashboardData.apiSummary?.pending ?? 0}
                            </span>
                          </div>
                          <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 flex flex-col justify-center text-left">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pendapatan Kotor</span>
                            <span className="text-lg font-black text-zinc-150 mt-1">
                              {dashboardData.apiSummary?.totalRevenue ?? 'Rp 0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <RecentOrders orders={dashboardData.recentOrders} />
                </div>
              </>
            ) : null}
          </main>
        )}

        {activeTab === 'withdraw' && (
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pb-28 md:pb-8 flex flex-col items-center justify-start animate-in fade-in duration-300">
            {loading ? (
               <div className="text-zinc-500 animate-pulse mt-12">Memuat informasi saldo...</div>
            ) : error ? (
               <div className="text-red-400 mt-12 text-sm">{error}</div>
            ) : (
               <WithdrawView 
                 balance={dashboardData?.stats?.balance?.value || "Rp 0"} 
                 session={session} 
                 onWithdrawSuccess={fetchDashboardData}
               />
            )}
          </main>
        )}

        {activeTab === 'payments' && (
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 pb-28 md:pb-8 flex flex-col items-center justify-start animate-in fade-in duration-300">
            <header className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Payment Link
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5">Buat tautan pembayaran QRIS dengan cepat.</p>
            </header>

            <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-450">
              <PaymentLinkGenerator />
            </div>
          </main>
        )}

        {activeTab === 'donations' && (
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pb-28 md:pb-8 flex flex-col items-center justify-start animate-in fade-in duration-300">
            <CampaignsList 
              onNewCampaign={() => {
                window.history.pushState({}, '', '/donate/create-new');
                setActiveTab('create-campaign');
              }} 
              onViewDetails={(id) => {
                setAdminCampaignId(id);
                setActiveTab('campaign-details');
              }}
            />
          </main>
        )}

        {activeTab === 'campaign-details' && (
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pb-28 md:pb-8 flex flex-col items-center justify-start animate-in fade-in duration-300">
            <CampaignDetails 
              campaignId={adminCampaignId} 
              onBack={() => setActiveTab('donations')} 
            />
          </main>
        )}

        {activeTab === 'create-campaign' && (
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pb-28 md:pb-8 flex flex-col items-center justify-start animate-in fade-in duration-300">
            <CreateCampaign 
              onBack={() => {
                window.history.pushState({}, '', '/');
                setActiveTab('donations');
              }}
              onSuccess={() => {
                window.history.pushState({}, '', '/');
                setActiveTab('donations');
              }}
            />
          </main>
        )}

        {activeTab === 'pay-invoice' && (
          <main className="flex-grow flex items-center justify-center p-4 min-h-screen bg-zinc-950">
            <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-450">
              <DirectPayView payInvoiceId={payInvoiceId} />
            </div>
          </main>
        )}

        {activeTab === 'donate-public' && (
          <main className="flex-grow flex items-center justify-center p-0 min-h-screen bg-zinc-950">
            <div className="w-full h-full min-h-screen animate-in fade-in slide-in-from-bottom-3 duration-450">
              <DonateView campaignId={donateCampaignId} />
            </div>
          </main>
        )}

        {activeTab === 'donate-ended' && (
          <main className="flex-grow flex items-center justify-center p-0 min-h-screen bg-zinc-950">
            <div className="w-full h-full min-h-screen animate-in fade-in slide-in-from-bottom-3 duration-450">
              <DonateEndedView campaignId={donateCampaignId} />
            </div>
          </main>
        )}

        {activeTab === 'analytics' && (
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-8 flex flex-col">
            {loading ? (
              <AnalyticsSkeleton />
            ) : error ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 text-center max-w-sm w-full shadow-lg">
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">Terjadi Kesalahan</h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{error}</p>
                  <button
                    onClick={fetchDashboardData}
                    className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-xs shadow-sm"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            ) : dashboardData ? (
              <>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <PageHeader 
                    title="Analytics" 
                    subtitle="Analisis performa transaksi dan metode pembayaran" 
                    onRefresh={fetchDashboardData} 
                    isLoading={loading} 
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-550">
                  <div className="lg:col-span-2">
                    <PerformanceChart chartData={dashboardData.chartData} />
                  </div>
                  <div>
                    <SalesOverview overview={dashboardData.salesOverview} />
                  </div>
                </div>
              </>
            ) : null}
          </main>
        )}

        {activeTab === 'settings' && (
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-8 flex flex-col items-start text-left">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Settings
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5">
                Kelola preferensi akun dan tampilan aplikasi Anda.
              </p>
            </div>

            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-bold text-zinc-100 mb-6">Tampilan (Appearance)</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">Mode Gelap (Dark Mode)</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Ubah tema aplikasi antara mode gelap dan terang.
                  </p>
                </div>
                
                {/* Custom Shadcn-like Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDarkMode}
                  onClick={toggleTheme}
                  className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <span
                    data-state={isDarkMode ? 'checked' : 'unchecked'}
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'history' && (
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-8 flex flex-col items-start text-left">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
                Riwayat Transaksi
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5">
                Daftar lengkap riwayat pembayaran dan status.
              </p>
            </div>
            
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {dashboardData ? (
                <RecentOrders orders={dashboardData.recentOrders} />
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 text-sm">
                  Memuat data riwayat...
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      <Toaster />
    </div>
  );
}
