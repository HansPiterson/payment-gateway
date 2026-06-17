import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../ui/use-toast';
import { Drawer } from 'vaul';

export default function CampaignDetails({ campaignId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop && isConfirmOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (isDesktop && !isConfirmOpen && dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isDesktop, isConfirmOpen]);

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

  const handleCloseDonation = async () => {
    setIsClosing(true);
    try {
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ is_active: false })
        .eq('id', campaignId);

      if (updateError) throw updateError;
      
      setCampaign(prev => ({ ...prev, is_active: false }));
      setIsConfirmOpen(false);
      toast({
        title: 'Donasi Ditutup',
        description: 'Kampanye donasi berhasil diakhiri.',
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Gagal Menutup Donasi',
        description: err.message,
        variant: 'error'
      });
    } finally {
      setIsClosing(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          ← Kembali ke Daftar
        </button>
        {campaign.is_active && (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="py-1.5 px-4 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 border border-red-900/50 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            Tutup Donasi
          </button>
        )}
        {!campaign.is_active && (
          <div className="py-1.5 px-3 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-lg text-xs font-bold">
            Sudah Berakhir
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      {isDesktop ? (
        <dialog
          ref={dialogRef}
          onClose={() => setIsConfirmOpen(false)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl text-zinc-100 backdrop:bg-zinc-950/80 backdrop:backdrop-blur-sm focus:outline-none animate-in fade-in zoom-in duration-200"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-2">Donasi Selesai?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Donasi akan ditutup dan pengguna yang mengakses link akan diarahkan ke halaman akhir. Riwayat daftar donatur tetap dapat dilihat di dashboard.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsConfirmOpen(false)}
              disabled={isClosing}
              className="py-2.5 px-4 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-300 font-semibold rounded-lg text-xs transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleCloseDonation}
              disabled={isClosing}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {isClosing ? 'Menutup...' : 'Ya, Tutup Donasi'}
            </button>
          </div>
        </dialog>
      ) : (
        <Drawer.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Drawer.Content className="bg-zinc-900 flex flex-col rounded-t-[20px] h-[320px] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800">
              <div className="p-4 bg-zinc-900 rounded-t-[20px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-6" />
                <div className="px-2 text-center space-y-3">
                  <Drawer.Title className="font-bold text-xl text-zinc-100">
                    Donasi Selesai?
                  </Drawer.Title>
                  <Drawer.Description className="text-sm text-zinc-400 mb-6 px-4">
                    Donasi akan ditutup dan link akan otomatis diarahkan ke halaman akhir. Riwayat donatur tetap tersimpan.
                  </Drawer.Description>
                  <div className="flex flex-col gap-3 mt-8">
                    <button
                      onClick={handleCloseDonation}
                      disabled={isClosing}
                      className="w-full py-4 bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isClosing ? 'Menutup...' : 'Ya, Tutup Donasi'}
                    </button>
                    <button
                      onClick={() => setIsConfirmOpen(false)}
                      disabled={isClosing}
                      className="w-full py-4 bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold rounded-xl active:scale-[0.98] transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}

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
