import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'analytics') {
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
        setWithdrawSuccess(res.data.message);
        setWithdrawAmount('');
        // Refresh dashboard data
        fetchDashboardData();
        // Close modal after delay
        setTimeout(() => {
          setIsWithdrawOpen(false);
          setWithdrawSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setWithdrawError(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' && (
        <main className="page-content">
          <div className="animate-in">
            <PageHeader 
              onRefresh={fetchDashboardData} 
              isLoading={loading} 
              onWithdraw={() => setIsWithdrawOpen(true)}
            />
          </div>

          {loading && !dashboardData && (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Memuat data transaksi dari Bayar.gg...</p>
            </div>
          )}

          {error && (
            <div className="dashboard-error">
              <div className="error-card">
                <h3>Terjadi Kesalahan</h3>
                <p>{error}</p>
                <button onClick={fetchDashboardData} className="retry-btn">Coba Lagi</button>
              </div>
            </div>
          )}

          {dashboardData && !loading && (
            <>
              <div className="animate-in animate-in-1">
                <StatsCards stats={dashboardData.stats} />
              </div>

              <div className="animate-in animate-in-2">
                <RecentOrders orders={dashboardData.recentOrders} />
              </div>
            </>
          )}
        </main>
      )}

      {activeTab === 'payments' && (
        <main className="page-content" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="checkout-container" style={{ width: '100%', maxWidth: '780px' }}>
            <header className="brand-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '28px', color: '#202224' }}>
                Halaman Pembayaran
              </h1>
              <p style={{ color: '#6B7280', marginTop: '6px' }}>Pilih paket layanan dan bayar instan menggunakan QRIS</p>
            </header>

            <StepIndicator currentStep={checkoutStep} totalSteps={4} />

            {/* Step 1: Service Selection */}
            {checkoutStep === 1 && (
              <div className="animate-slide-in">
                <div className="glass-card">
                  <div className="glass-card-header">
                    <h2 className="glass-card-title">Pilih Layanan</h2>
                    <p className="glass-card-subtitle">
                      Pilih paket layanan yang sesuai dengan kebutuhan Anda
                    </p>
                  </div>

                  <div className="services-grid">
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
                    className="btn-primary"
                    disabled={!selectedService}
                    onClick={handleServiceContinue}
                    style={{ marginTop: '20px' }}
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
          </div>
        </main>
      )}

      {activeTab === 'analytics' && (
        <main className="page-content">
          <div className="animate-in">
            <PageHeader 
              title="Analytics" 
              subtitle="Analisis performa transaksi dan metode pembayaran" 
              onRefresh={fetchDashboardData} 
              isLoading={loading} 
            />
          </div>

          {loading && !dashboardData && (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Memuat data analitik dari Bayar.gg...</p>
            </div>
          )}

          {error && (
            <div className="dashboard-error">
              <div className="error-card">
                <h3>Terjadi Kesalahan</h3>
                <p>{error}</p>
                <button onClick={fetchDashboardData} className="retry-btn">Coba Lagi</button>
              </div>
            </div>
          )}

          {dashboardData && !loading && (
            <div className="charts-grid animate-in animate-in-1">
              <PerformanceChart chartData={dashboardData.chartData} />
              <SalesOverview overview={dashboardData.salesOverview} />
            </div>
          )}
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="page-content">
          <div className="animate-in">
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#202224' }}>
              Settings
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#666', marginTop: '10px' }}>
              Halaman ini sedang dalam pengembangan.
            </p>
          </div>
        </main>
      )}

      {/* Withdraw Modal */}
      {isWithdrawOpen && (
        <div className="modal-overlay" onClick={() => setIsWithdrawOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tarik Saldo</h3>
              <button className="modal-close-btn" onClick={() => setIsWithdrawOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="modal-body">
                {withdrawSuccess && <div className="alert-success">{withdrawSuccess}</div>}
                {withdrawError && <div className="alert-error">{withdrawError}</div>}
                
                <div className="form-group">
                  <label className="form-label" htmlFor="withdraw-amount">Jumlah Penarikan (Rupiah)</label>
                  <input
                    type="number"
                    id="withdraw-amount"
                    className="form-input"
                    placeholder="Contoh: 1000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    disabled={withdrawLoading || withdrawSuccess}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsWithdrawOpen(false)}
                  disabled={withdrawLoading}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-withdraw" 
                  disabled={withdrawLoading || withdrawSuccess}
                >
                  {withdrawLoading ? 'Memproses...' : 'Tarik Saldo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          font-family: 'Poppins', sans-serif;
          color: #6B7280;
        }
        .dashboard-loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(72, 128, 255, 0.1);
          border-top-color: #4880FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .dashboard-error {
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Poppins', sans-serif;
        }
        .error-card {
          background: #FFF;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .error-card h3 {
          color: #F93C65;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .error-card p {
          color: #6B7280;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .retry-btn {
          background: #4880FF;
          color: #FFF;
          border: none;
          padding: 8px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: background 0.2s;
        }
        .retry-btn:hover {
          background: #3570F4;
        }

        /* Modal Style */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-container {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Poppins', sans-serif;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #202224;
        }
        .modal-close-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #9CA3AF;
          cursor: pointer;
        }
        .modal-body {
          margin-bottom: 24px;
        }
        .form-group {
          margin-bottom: 16px;
          text-align: left;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #4B5563;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          font-family: 'Poppins', sans-serif;
          color: #202224;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #4880FF;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-cancel {
          background: #F3F4F6;
          color: #4B5563;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-withdraw {
          background: #00B69B;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-withdraw:disabled {
          background: #A7F3D0;
          cursor: not-allowed;
        }
        .alert-success {
          background: #ECFDF5;
          color: #065F46;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          border: 1px solid #A7F3D0;
        }
        .alert-error {
          background: #FEF2F2;
          color: #991B1B;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          border: 1px solid #FCA5A5;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
