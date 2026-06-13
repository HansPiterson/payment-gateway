import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import PageHeader from './components/layout/PageHeader';
import StatsCards from './components/dashboard/StatsCards';
import PerformanceChart from './components/dashboard/PerformanceChart';
import SalesOverview from './components/dashboard/SalesOverview';
import RecentOrders from './components/dashboard/RecentOrders';
import { FUNCTIONS_URL } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
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

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' ? (
        <main className="page-content">
          <div className="animate-in">
            <PageHeader onRefresh={fetchDashboardData} isLoading={loading} />
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

              <div className="charts-grid animate-in animate-in-2">
                <PerformanceChart chartData={dashboardData.chartData} />
                <SalesOverview overview={dashboardData.salesOverview} />
              </div>

              <div className="animate-in animate-in-3">
                <RecentOrders orders={dashboardData.recentOrders} />
              </div>
            </>
          )}
        </main>
      ) : (
        <main className="page-content">
          <div className="animate-in">
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#202224' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#666', marginTop: '10px' }}>
              Halaman ini sedang dalam pengembangan.
            </p>
          </div>
        </main>
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
      `}</style>
    </div>
  );
}
