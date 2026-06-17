import { useState } from 'react';
import { BankIcon, UserCircleIcon, Coins01Icon } from 'hugeicons-react';
import { FUNCTIONS_URL, supabaseAnonKey } from '../lib/supabase';
import { toast } from './ui/use-toast';

export default function WithdrawView({ balance, session, onWithdrawSuccess }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [destination, setDestination] = useState('DANA');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawLoading(true);
    setWithdrawError(null);

    // Filter non-numeric characters from the input value, if any
    const rawAmount = withdrawAmount.replace(/[^0-9]/g, '');
    const amount = Number(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Jumlah penarikan tidak valid.');
      setWithdrawLoading(false);
      return;
    }

    try {
      const response = await fetch(`${FUNCTIONS_URL}/create-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ 
          amount,
          destination,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Gagal memproses penarikan.');
      }

      if (res.success) {
        setWithdrawAmount('');
        toast({
          title: "Penarikan Berhasil!",
          description: res.data?.message || "Permintaan penarikan dana Anda sedang diproses.",
          duration: 4000,
        });
        if (onWithdrawSuccess) {
          onWithdrawSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      setWithdrawError(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setWithdrawAmount(value);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="w-full text-left mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Penarikan Saldo
        </h1>
        <p className="text-sm md:text-base text-zinc-400 mt-2">
          Tarik dana penghasilan Anda ke rekening atau dompet digital pilihan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
        {/* Left Column: Info & Profile */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 bg-transparent border-b border-zinc-800/50 pb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 flex-shrink-0">
              <UserCircleIcon size={36} />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="text-lg md:text-xl font-bold text-zinc-100">
                Admin Akun
              </h2>
              <p className="text-sm text-zinc-400">
                {session?.user?.email || 'admin@bayar.dev'}
              </p>
            </div>
          </div>

          {/* Balance Section */}
          <div className="pt-2">
            <div className="text-left flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
                Saldo Tersedia
              </span>
              <Coins01Icon size={20} className="text-zinc-600" />
            </div>
            <div className="text-left">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-100 tracking-tight">
                {balance}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleWithdrawSubmit} className="space-y-6 md:space-y-8 bg-transparent">
            {withdrawError && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-4 rounded-xl text-sm font-semibold text-left">
                {withdrawError}
              </div>
            )}

            <div className="text-left space-y-3">
              <label className="text-sm md:text-base font-bold text-zinc-300 block">
                Nominal Penarikan
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 md:left-6 font-bold text-zinc-500 md:text-lg">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none text-xl md:text-2xl font-black transition-all focus:border-zinc-500 focus:ring-2 focus:ring-zinc-800/50 placeholder:text-zinc-700 disabled:opacity-50"
                  placeholder="0"
                  value={withdrawAmount}
                  onChange={handleAmountChange}
                  required
                  disabled={withdrawLoading}
                />
              </div>
            </div>

            <div className="text-left space-y-3">
              <label className="text-sm md:text-base font-bold text-zinc-300 block">
                Tujuan Transfer
              </label>
              <div className="relative">
                <select
                  className="w-full px-6 py-4 md:py-5 rounded-2xl bg-zinc-900 text-zinc-200 border border-zinc-800 outline-none text-base md:text-lg font-bold transition-all focus:border-zinc-500 appearance-none disabled:opacity-50"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={withdrawLoading}
                >
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                  <option value="GOPAY">GoPay</option>
                  <option value="SHOPEEPAY">ShopeePay</option>
                  <option value="BCA">Bank BCA</option>
                  <option value="MANDIRI">Bank Mandiri</option>
                  <option value="BNI">Bank BNI</option>
                  <option value="BRI">Bank BRI</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <BankIcon size={24} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 mt-6 md:mt-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-black rounded-2xl text-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-3"
              disabled={withdrawLoading || !withdrawAmount}
            >
              {withdrawLoading ? (
                <span className="w-6 h-6 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Tarik Saldo Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
