import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PaymentStep from './PaymentStep';
import SuccessPage from './SuccessPage';

export default function DonateView({ campaignId }) {
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form'); // form | payment | success

  // Form states
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Donasi tidak ditemukan.');
        if (!data.is_active) {
          window.location.href = `/donate/end/${campaignId}`;
          return;
        }
        
        setCampaign(data);
        if (data.donation_type === 'fixed' && data.fixed_amounts?.length > 0) {
          setAmount(data.fixed_amounts[0].toString());
        }

        // Fetch collected amount
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId]);

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseInt(amount, 10);

    if (campaign.donation_type === 'free') {
      if (numAmount < 1000 || numAmount > 500000) {
        setError('Nominal donasi harus antara Rp 1.000 - Rp 500.000');
        return;
      }
    }

    if (!donorName || !donorEmail) {
      setError('Nama dan Email wajib diisi.');
      return;
    }

    setStep('payment');
  };

  const serviceMock = {
    name: `Donasi: ${campaign?.title}`,
    price: parseInt(amount, 10),
  };

  const customerMock = {
    name: donorName,
    email: donorEmail,
    phone: '',
  };

  const handleAnonymousChange = (e) => {
    const isAnon = e.target.checked;
    setIsAnonymous(isAnon);
    if (isAnon) {
      setDonorName('Anonymous');
      setDonorEmail('anonymous@unknown.mail');
    } else {
      setDonorName('');
      setDonorEmail('');
    }
  };

  // When payment is successful
  const handlePaymentSuccess = (paymentRes) => {
    setPaymentData(paymentRes);
    setStep('success');
  };

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-zinc-400">Memuat halaman donasi...</div>;
  }

  if (error && step === 'form') {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-lg font-bold text-zinc-100 mb-2">Gagal Memuat Donasi</h2>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="w-full max-w-xl mx-auto text-left py-8 md:py-12">
      {step === 'form' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          {campaign.banner_url && (
            <div className="w-full h-48 md:h-64 overflow-hidden relative">
              <img src={campaign.banner_url} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>
          )}
          
          <div className="p-6 md:p-8 relative">
            {campaign.logo_url && (
              <img 
                src={campaign.logo_url} 
                alt="Logo" 
                className="w-16 h-16 rounded-xl border-4 border-zinc-900 absolute -top-8 bg-zinc-800 object-cover" 
              />
            )}
            
            <div className={campaign.logo_url && !campaign.banner_url ? 'mt-8' : (campaign.logo_url ? 'mt-4' : '')}>
              <span className="inline-block px-2.5 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                {campaign.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 leading-tight mb-2">
                {campaign.title}
              </h1>
              {campaign.description && (
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {campaign.description}
                </p>
              )}
            </div>

            {campaign.target_amount && (
              <div className="mb-8 p-4 rounded-xl bg-zinc-950 border border-zinc-850">
                <div className="flex justify-between items-end mb-1">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Terkumpul</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Target: Rp {campaign.target_amount.toLocaleString('id-ID')}</div>
                </div>
                <div className="text-xl font-black text-zinc-100">
                  Rp {collectedAmount.toLocaleString('id-ID')}
                </div>
                
                {/* Shadcn UI Style Progress Bar */}
                <div className="relative w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-zinc-100 transition-all duration-500 ease-out rounded-full" 
                    style={{ width: `${Math.min((collectedAmount / campaign.target_amount) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] font-medium text-zinc-500 mt-2 text-right">
                  {Math.min(Math.round((collectedAmount / campaign.target_amount) * 100), 100)}% tercapai
                </div>
              </div>
            )}

            <form onSubmit={handleDonateSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-950/50 border border-red-900 text-red-200 p-3 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Nominal Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pilih Nominal Donasi</label>
                {campaign.donation_type === 'fixed' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {campaign.fixed_amounts.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt.toString())}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                          amount === amt.toString() 
                            ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-zinc-100 ring-offset-2 ring-offset-zinc-950' 
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
                        }`}
                      >
                        <span>Rp {amt.toLocaleString('id-ID')}</span>
                        {amount === amt.toString() && (
                          <div className="w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-100">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 50000"
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors font-semibold"
                  />
                )}
              </div>

              {/* Data Diri Section */}
              <div className="space-y-4 pt-4 border-t border-zinc-850">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Informasi Donatur</label>
                
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    required
                    disabled={isAnonymous}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="email"
                    required
                    disabled={isAnonymous}
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="Alamat Email"
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={handleAnonymousChange}
                    className="w-4 h-4 accent-zinc-400 rounded bg-zinc-900 border-zinc-800"
                  />
                  <span className="text-sm text-zinc-400 font-medium">Sembunyikan nama saya (Anonim)</span>
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan atau doa (opsional)..."
                  rows="3"
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-black tracking-wide rounded-xl transition-all shadow-md mt-6"
              >
                Lanjut Pembayaran
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <PaymentStep
          service={serviceMock}
          customer={customerMock}
          onSuccess={handlePaymentSuccess}
          onBack={() => setStep('form')}
          donationData={{
            campaign_id: campaignId,
            is_anonymous: isAnonymous,
            message: message
          }}
        />
      )}

      {step === 'success' && paymentData && (
        <SuccessPage
          paymentData={paymentData}
          customer={customerMock}
          service={serviceMock}
        />
      )}
    </div>
  );
}
