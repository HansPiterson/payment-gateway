import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import PageHeader from './components/layout/PageHeader';
import StatsCards from './components/dashboard/StatsCards';
import PerformanceChart from './components/dashboard/PerformanceChart';
import SalesOverview from './components/dashboard/SalesOverview';
import RecentOrders from './components/dashboard/RecentOrders';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="page-content">
        <div className="animate-in">
          <PageHeader />
        </div>

        <div className="animate-in animate-in-1">
          <StatsCards />
        </div>

        <div className="charts-grid animate-in animate-in-2">
          <PerformanceChart />
          <SalesOverview />
        </div>

        <div className="animate-in animate-in-3">
          <RecentOrders />
        </div>
      </main>
    </div>
  );
}
