import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DonationStatsCard({ onClick }) {
  const [stats, setStats] = useState({ totalRevenue: 0, totalLinks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count, error: countError } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;

        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('amount')
          .not('campaign_id', 'is', null)
          .in('status', ['paid', 'success']);

        if (paymentsError) throw paymentsError;

        const revenue = paymentsData ? paymentsData.reduce((acc, curr) => acc + curr.amount, 0) : 0;

        setStats({ totalRevenue: revenue, totalLinks: count || 0 });
      } catch (err) {
        console.error('Error fetching donation stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-500/30 rounded-xl p-5 md:p-6 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all flex flex-col justify-between w-full h-full relative overflow-hidden group"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-indigo-500/10 blur-[40px] pointer-events-none transition-all group-hover:bg-indigo-500/20" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          TOTAL DONASI
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 backdrop-blur-sm border border-indigo-500/30">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>
      <div className="relative z-10">
        {loading ? (
          <div className="h-8 w-32 bg-indigo-500/20 rounded animate-pulse mb-2" />
        ) : (
          <div className="text-2xl md:text-3xl font-black text-indigo-50 mb-1">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </div>
        )}
        {loading ? (
           <div className="h-4 w-24 bg-indigo-500/20 rounded animate-pulse" />
        ) : (
          <div className="text-xs text-indigo-300 font-medium flex items-center gap-2">
            <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">{stats.totalLinks} LINK DONASI</span>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">Lihat Detail &rarr;</span>
          </div>
        )}
      </div>
    </div>
  );
}
