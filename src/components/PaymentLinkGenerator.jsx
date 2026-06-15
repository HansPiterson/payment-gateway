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
      <div className="glass-panel rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
        {/* Subtle glow decorative element */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {!generatedLink ? (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Buat Link Pembayaran</h2>
              <p className="text-[13px] text-muted-foreground mt-1.5">Masukkan nominal dan deskripsi opsional untuk membuat QRIS instan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl text-[13px] font-medium text-center leading-relaxed animate-fade-in">
                  {error}
                </div>
              )}

              {/* Amount Input */}
              <div className="flex flex-col items-center space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-1 text-center">
                  Nominal Pembayaran
                </label>
                <div className="flex items-center justify-center relative pb-3 border-b border-border focus-within:border-primary transition-colors w-full max-w-[280px]">
                  <span className="text-xl font-bold text-muted-foreground mr-1.5 select-none mt-1">Rp</span>
                  <input
                    type="text"
                    className="w-full bg-transparent text-foreground text-4xl font-extrabold text-center outline-none transition-all placeholder:text-muted-foreground/40"
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
                <div className="w-full max-w-[280px]">
                  <input
                    id="payment-description"
                    type="text"
                    className="w-full bg-secondary text-foreground rounded-xl border border-transparent focus:border-primary focus:bg-background outline-none text-[14px] text-center py-3 px-4 transition-all placeholder:text-muted-foreground"
                    placeholder="Deskripsi pembayaran..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                  <span className="text-[11px] text-muted-foreground mt-2 block text-center font-medium">Opsional, tapi membantu pelacakan</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full max-w-[280px] mx-auto py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-[1.25rem] transition-ios text-[15px] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2"
                disabled={loading || !rawAmount}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Buat Pembayaran Sekarang'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-sm">
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Link Berhasil Dibuat!</h2>
              <p className="text-[13px] text-muted-foreground mt-1.5">Gunakan tautan di bawah ini untuk menerima pembayaran.</p>
            </div>

            {/* Generated Link Display */}
            <div className="bg-secondary/60 border border-border rounded-2xl p-3 flex items-center justify-between text-left w-full max-w-[320px] mx-auto animate-in zoom-in-95 duration-200">
              <span className="text-[13px] text-foreground truncate flex-1 font-mono pr-3 pl-2 select-all">
                {generatedLink}
              </span>
              <button
                onClick={handleCopy}
                className="py-2 px-4 bg-background hover:bg-secondary border border-border text-foreground rounded-xl transition-ios text-[12px] font-bold flex-shrink-0 shadow-sm active:scale-95"
              >
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            <div className="flex gap-3 pt-4 max-w-[320px] mx-auto">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-secondary border border-transparent hover:border-border text-foreground font-bold rounded-xl text-[13px] transition-ios active:scale-95"
              >
                Buat Baru
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-[13px] transition-ios active:scale-95 flex items-center justify-center gap-1 shadow-sm"
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
