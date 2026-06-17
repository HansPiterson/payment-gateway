import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../lib/supabase';

export default function DonateEndedView({ campaignId }) {
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [collectedAmount, setCollectedAmount] = useState(0);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      try {
        const { data: campaignData } = await supabase
          .from('campaigns')
          .select('title')
          .eq('id', campaignId)
          .single();
        
        if (campaignData) setCampaign(campaignData);

        const { data: paymentsData } = await supabase
          .from('payments')
          .select('amount')
          .eq('campaign_id', campaignId)
          .in('status', ['paid', 'success']);
        
        if (paymentsData) {
          const total = paymentsData.reduce((acc, curr) => acc + curr.amount, 0);
          setCollectedAmount(total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchCampaignData();
  }, [campaignId]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 animate-pulse">Memuat...</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto text-center py-16 md:py-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-64 h-64 mx-auto mb-8 pointer-events-none">
        <DotLottieReact
          src="https://lottie.host/e6d39457-6b16-4173-a705-09cb99d061d8/vJZlvjsX0P.lottie"
          loop={false}
          autoplay
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mb-2">
        Donasi Telah Berakhir
      </h1>
      
      {campaign && (
        <p className="text-zinc-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Terima kasih kepada semua donatur! Kampanye <span className="font-semibold text-zinc-300">"{campaign.title}"</span> telah resmi ditutup.
        </p>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl max-w-xs mx-auto">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
          Total Dana Terkumpul
        </div>
        <div className="text-3xl font-black text-indigo-400">
          Rp {collectedAmount.toLocaleString('id-ID')}
        </div>
      </div>
      
      <div className="mt-12 text-xs text-zinc-600 font-medium">
        Powered by <span className="font-bold text-zinc-500">BAYAR.dev</span>
      </div>
    </div>
  );
}
