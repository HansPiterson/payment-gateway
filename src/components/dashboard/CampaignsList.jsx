import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function CampaignsList({ onNewCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id) => {
    const url = `${window.location.origin}/donate/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link Donasi disalin: ' + url);
  };

  if (loading) {
    return <div className="text-zinc-400 py-12 text-center animate-pulse">Memuat Daftar Donasi...</div>;
  }

  if (error) {
    return <div className="text-red-400 py-12 text-center">Gagal memuat: {error}</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Daftar Donasi</h2>
          <p className="text-xs text-zinc-400 mt-1">Kelola link penggalangan dana Anda</p>
        </div>
        <button
          onClick={onNewCampaign}
          className="py-2 px-4 bg-zinc-100 text-zinc-950 font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors"
        >
          + Buat Link Donasi
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            Belum ada link donasi. Buat yang pertama sekarang!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Judul Donasi</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Target</th>
                  <th className="px-6 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-zinc-850/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-200">{camp.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{new Date(camp.created_at).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">
                        {camp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 font-mono">
                      {camp.target_amount ? `Rp ${camp.target_amount.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyToClipboard(camp.id)}
                        className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Salin Link
                      </button>
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
