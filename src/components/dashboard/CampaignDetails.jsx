import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function CampaignDetails({ campaignId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();
        
        if (campaignError) throw campaignError;
        setCampaign(campaignData);

        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('campaign_id', campaignId)
          .in('status', ['paid', 'success'])
          .order('created_at', { ascending: false });

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchDetails();
  }, [campaignId]);

  if (loading) {
    return <div className="text-zinc-400 py-12 text-center animate-pulse">Memuat Detail Donasi...</div>;
  }

  if (error || !campaign) {
    return <div className="text-red-400 py-12 text-center">Gagal memuat: {error || 'Kampanye tidak ditemukan'}</div>;
  }

  const collectedAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDonators = payments.length;
  const progressPercent = campaign.target_amount 
    ? Math.min(Math.round((collectedAmount / campaign.target_amount) * 100), 100) 
    : 0;

  return (
    <div className="w-full space-y-6 text-left">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        ← Kembali ke Daftar
      </button>

      {/* Header & Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {campaign.logo_url && (
            <img 
              src={campaign.logo_url} 
              alt="Logo" 
              className="w-20 h-20 rounded-xl object-cover bg-zinc-800 flex-shrink-0" 
            />
          )}
          <div className="flex-grow">
            <span className="inline-block px-2.5 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
              {campaign.category}
            </span>
            <h2 className="text-2xl font-bold text-zinc-100">{campaign.title}</h2>
            <div className="text-xs text-zinc-500 mt-1">
              Dibuat pada: {new Date(campaign.created_at).toLocaleDateString('id-ID')}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px] w-full md:w-auto p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Terkumpul</div>
            <div className="text-xl font-black text-zinc-100">Rp {collectedAmount.toLocaleString('id-ID')}</div>
            {campaign.target_amount && (
              <>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-zinc-100 transition-all rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-500 text-right mt-1">
                  Target: Rp {campaign.target_amount.toLocaleString('id-ID')} ({progressPercent}%)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1 font-semibold">Total Donatur</div>
          <div className="text-2xl font-bold text-zinc-100">{totalDonators}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1 font-semibold">Rata-rata Donasi</div>
          <div className="text-2xl font-bold text-zinc-100">
            Rp {totalDonators > 0 ? Math.round(collectedAmount / totalDonators).toLocaleString('id-ID') : 0}
          </div>
        </div>
      </div>

      {/* Donators List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-100">Daftar Donatur</h3>
        </div>
        {payments.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            Belum ada donasi yang masuk untuk kampanye ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Waktu</th>
                  <th className="px-6 py-4 font-semibold">Donatur</th>
                  <th className="px-6 py-4 font-semibold">Nominal</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Pesan/Doa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-zinc-850/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {new Date(payment.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      {payment.is_anonymous ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-400 italic">Hamba Allah</span>
                          <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Anonim</span>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-zinc-200">{payment.customer_name}</div>
                          <div className="text-[10px] text-zinc-500">{payment.customer_email}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-zinc-100">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      {payment.message ? (
                        <div className="text-sm text-zinc-300 italic whitespace-normal min-w-[200px]">"{payment.message}"</div>
                      ) : (
                        <span className="text-zinc-600 italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
