import { useState } from 'react';
import { FUNCTIONS_URL, supabaseAnonKey } from '../lib/supabase';

export default function PaymentLinkGenerator() {
  const [rawAmount, setRawAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  // Format amount input as thousands separated (e.g. 1,000)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Keep only numbers
    const clean = value.replace(/\D/g, '');
    setRawAmount(clean);
  };

  const formattedDisplayValue = rawAmount ? Number(rawAmount).toLocaleString('en-US') : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(rawAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Nominal harus lebih dari 0.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${FUNCTIONS_URL}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          amount: amountNum,
          description: description.trim() || 'Nominal Pembayaran',
          customer_name: 'Deskripsi Pembayaran: (Tidak ada)', // placeholder default
          customer_email: 'customer@bayar.dev', // placeholder
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Gagal membuat pembayaran.');
      }

      if (res.success) {
        const paymentId = res.data.id; // UUID from DB
        const generatedUrl = `${window.location.origin}/pay/${paymentId}`;
        setGeneratedLink(generatedUrl);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setRawAmount('');
    setDescription('');
    setGeneratedLink(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto text-left">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle glow decorative element */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        
        {!generatedLink ? (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Buat Link Pembayaran</h2>
              <p className="text-[11px] text-zinc-400 mt-1">Masukkan nominal dan deskripsi opsional untuk membuat QRIS instan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
              {error && (
                <div className="bg-zinc-950 border border-zinc-850 text-zinc-455 px-4 py-3 rounded-lg text-xs font-semibold text-center leading-relaxed animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Amount Input (Border-bottom only) */}
              <div className="flex flex-col items-center space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 text-center">
                  Nominal Pembayaran
                </label>
                <div className="flex items-center justify-center relative pb-2 border-b border-zinc-800 focus-within:border-zinc-400 transition-colors w-full max-w-[260px]">
                  <span className="text-lg font-bold text-zinc-500 mr-1.5 select-none">Rp</span>
                  <input
                    type="text"
                    className="w-full bg-transparent text-zinc-100 text-3xl font-extrabold text-center outline-none transition-all placeholder:text-zinc-800"
                    placeholder="0"
                    value={formattedDisplayValue}
                    onChange={handleAmountChange}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-[260px]">
                  <input
                    id="payment-description"
                    type="text"
                    className="w-full bg-transparent text-zinc-350 border-b border-zinc-800 focus:border-zinc-500 outline-none text-xs text-center py-2 transition-colors placeholder:text-zinc-700"
                    placeholder="Masukan deskripsi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                  <span className="text-[10px] text-zinc-500 mt-1.5 block text-center font-medium">Masukan deskripsi (opsional)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full max-w-[260px] mx-auto py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-all text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2"
                disabled={loading || !rawAmount}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Buat Pembayaran Sekarang'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-6 animate-in fade-in duration-350">
            <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center mx-auto text-zinc-100 shadow-md">
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-bold text-zinc-100">Link Berhasil Dibuat!</h2>
              <p className="text-[11px] text-zinc-400 mt-1">Gunakan tautan di bawah ini untuk menerima pembayaran.</p>
            </div>

            {/* Generated Link Display */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 flex items-center justify-between text-left w-full max-w-[320px] mx-auto animate-in zoom-in-95 duration-200">
              <span className="text-xs text-zinc-350 truncate flex-1 font-mono pr-3 pl-1.5 select-all">
                {generatedLink}
              </span>
              <button
                onClick={handleCopy}
                className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 rounded-md transition-all text-[10px] font-semibold flex-shrink-0"
              >
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            <div className="flex gap-3 pt-2 max-w-[260px] mx-auto">
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-3 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-350 hover:text-zinc-200 font-semibold rounded-md text-[11px] transition-colors"
              >
                Buat Baru
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-md text-[11px] transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                Uji Coba Link
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
