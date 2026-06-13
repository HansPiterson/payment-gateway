import { useState, useEffect, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import PageHeader from './components/layout/PageHeader';
import StatsCards from './components/dashboard/StatsCards';
import PerformanceChart from './components/dashboard/PerformanceChart';
import SalesOverview from './components/dashboard/SalesOverview';
import RecentOrders from './components/dashboard/RecentOrders';
import { FUNCTIONS_URL, supabaseAnonKey } from './lib/supabase';

// Checkout Components
import StepIndicator from './components/StepIndicator';
import ServiceCard from './components/ServiceCard';
import CustomerForm from './components/CustomerForm';
import PaymentStep from './components/PaymentStep';
import SuccessPage from './components/SuccessPage';

const SERVICES = [
  {
    id: 'basic',
    name: 'Starter',
    price: 50000,
    description: 'Cocok untuk kebutuhan dasar dan project kecil.',
    features: ['1x Konsultasi', 'Setup Dasar', 'Support 7 Hari'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 150000,
    description: 'Solusi lengkap untuk bisnis dan project profesional.',
    features: ['3x Konsultasi', 'Setup Advanced', 'Support 30 Hari', 'Priority Queue'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 500000,
    description: 'Layanan premium dengan dukungan penuh untuk skala besar.',
    features: ['Unlimited Konsultasi', 'Full Setup & Deploy', 'Support 90 Hari', 'Dedicated Team', 'Custom Integration'],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Checkout States
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Withdraw States
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'analytics') {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Handle native <dialog> state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isWithdrawOpen) {
      // Open dialog modal
      dialog.showModal();

      // Click event fallback for light-dismiss (outside dialog content area)
      const handleClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          setIsWithdrawOpen(false);
        }
      };

      // Listen for Esc key cancel requests
      const handleCancel = (event) => {
        event.preventDefault();
        setIsWithdrawOpen(false);
      };

      dialog.addEventListener('click', handleClick);
      dialog.addEventListener('cancel', handleCancel);

      return () => {
        dialog.removeEventListener('click', handleClick);
        dialog.removeEventListener('cancel', handleCancel);
      };
    } else {
      dialog.close();
    }
  }, [isWithdrawOpen]);

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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleServiceContinue = () => {
    if (selectedService) setCheckoutStep(2);
  };

  const handleCustomerSubmit = (data) => {
    setCustomerData(data);
    setCheckoutStep(3);
  };

  const handlePaymentSuccess = (data) => {
    setPaymentResult(data);
    setCheckoutStep(4);
  };

  const resetCheckout = () => {
    setCheckoutStep(1);
    setSelectedService(null);
    setCustomerData(null);
    setPaymentResult(null);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Jumlah penarikan tidak valid.');
      setWithdrawLoading(false);
      return;
    }

    try {
      const response = await fetch(`${FUNCTIONS_URL}/create-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ amount }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Gagal memproses penarikan.');
      }

      if (res.success) {
        setWithdrawSuccess(res.data.message || 'Berhasil menarik saldo.');
        setWithdrawAmount('');
        // Refresh dashboard data
        fetchDashboardData();
        // Close modal after delay
        setTimeout(() => {
          setIsWithdrawOpen(false);
          setWithdrawSuccess(null);
        }, 1800);
      }
    } catch (err) {
      console.error(err);
      setWithdrawError(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PageHeader 
              onRefresh={fetchDashboardData} 
              isLoading={loading} 
              onWithdraw={() => setIsWithdrawOpen(true)}
            />
          </div>

          {loading && !dashboardData && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-400">
              <div className="w-8 h-8 border-3 border-zinc-800 border-t-zinc-200 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Memuat data transaksi dari Bayar.gg...</p>
            </div>
          )}

          {error && (
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
          )}

          {dashboardData && !loading && (
            <div className="space-y-6 md:space-y-8 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <StatsCards stats={dashboardData.stats} />
              <RecentOrders orders={dashboardData.recentOrders} />
            </div>
          )}
        </main>
      )}

      {activeTab === 'payments' && (
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-start">
          <header className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Halaman Pembayaran
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">Pilih paket layanan dan bayar instan menggunakan QRIS</p>
          </header>

          <StepIndicator currentStep={checkoutStep} totalSteps={4} />

          {/* Step 1: Service Selection */}
          {checkoutStep === 1 && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-xl text-left">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-100">Pilih Layanan</h2>
                  <p className="text-xs text-zinc-400 mt-1">Pilih paket layanan yang sesuai dengan kebutuhan Anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {SERVICES.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService?.id === service.id}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>

                <button
                  className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-205 text-zinc-950 disabled:opacity-50 disabled:hover:bg-zinc-100 font-extrabold rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center"
                  disabled={!selectedService}
                  onClick={handleServiceContinue}
                  id="btn-continue-service"
                >
                  Lanjutkan →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Customer Form */}
          {checkoutStep === 2 && (
            <CustomerForm
              onSubmit={handleCustomerSubmit}
              onBack={() => setCheckoutStep(1)}
              initialData={customerData}
            />
          )}

          {/* Step 3: Payment */}
          {checkoutStep === 3 && (
            <PaymentStep
              service={selectedService}
              customer={customerData}
              onSuccess={handlePaymentSuccess}
              onBack={() => setCheckoutStep(2)}
            />
          )}

          {/* Step 4: Success */}
          {checkoutStep === 4 && (
            <SuccessPage
              paymentData={paymentResult}
              customer={customerData}
              service={selectedService}
              onReset={resetCheckout}
            />
          )}
        </main>
      )}

      {activeTab === 'analytics' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PageHeader 
              title="Analytics" 
              subtitle="Analisis performa transaksi dan metode pembayaran" 
              onRefresh={fetchDashboardData} 
              isLoading={loading} 
            />
          </div>

          {loading && !dashboardData && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-400">
              <div className="w-8 h-8 border-3 border-zinc-800 border-t-zinc-200 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Memuat data analitik dari Bayar.gg...</p>
            </div>
          )}

          {error && (
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
          )}

          {dashboardData && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-550">
              <div className="lg:col-span-2">
                <PerformanceChart chartData={dashboardData.chartData} />
              </div>
              <div>
                <SalesOverview overview={dashboardData.salesOverview} />
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col items-start text-left">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Settings
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              Halaman ini sedang dalam pengembangan.
            </p>
          </div>
        </main>
      )}

      {/* Modern native <dialog> for Withdrawal */}
      <dialog
        ref={dialogRef}
        closedby="any"
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-zinc-100 backdrop:bg-zinc-950/80 backdrop:backdrop-blur-sm focus:outline-none outline-none animate-in fade-in zoom-in duration-200"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="text-lg font-bold text-zinc-100">Tarik Saldo</h3>
          <button
            className="text-zinc-500 hover:text-zinc-300 font-bold text-lg focus:outline-none transition-colors"
            onClick={() => setIsWithdrawOpen(false)}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleWithdrawSubmit} className="space-y-5">
          {withdrawSuccess && (
            <div className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-lg text-xs font-semibold leading-relaxed">
              {withdrawSuccess}
            </div>
          )}
          {withdrawError && (
            <div className="bg-zinc-950 border border-zinc-850 text-zinc-400 px-4 py-3 rounded-lg text-xs font-semibold leading-relaxed">
              {withdrawError}
            </div>
          )}
          
          <div className="text-left">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2" htmlFor="withdraw-amount">
              Jumlah Penarikan (Rupiah)
            </label>
            <input
              type="number"
              id="withdraw-amount"
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-150 border border-zinc-850 outline-none text-sm transition-all focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 disabled:opacity-50"
              placeholder="Contoh: 1000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
              disabled={withdrawLoading || withdrawSuccess}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="py-2.5 px-4 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-300 font-semibold rounded-lg text-xs transition-colors"
              onClick={() => setIsWithdrawOpen(false)}
              disabled={withdrawLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-xs transition-colors disabled:opacity-50 shadow-sm"
              disabled={withdrawLoading || withdrawSuccess}
            >
              {withdrawLoading ? 'Memproses...' : 'Tarik Saldo'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
