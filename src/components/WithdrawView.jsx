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
    <div className="w-full max-w-md mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="w-full text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
          Penarikan Saldo
        </h1>
        <p className="text-xs text-zinc-400 mt-1.5">
          Tarik dana ke rekening atau dompet digital Anda.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4 border-b border-zinc-800/50 pb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0">
            <UserCircleIcon size={24} />
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-sm font-bold text-zinc-100 leading-tight">Admin Akun</h2>
            <p className="text-[10px] text-zinc-500">{session?.user?.email || 'admin@bayar.dev'}</p>
          </div>
        </div>

        <div className="text-left">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
            Saldo Tersedia
          </span>
          <div className="text-3xl font-black text-zinc-100 tracking-tight flex items-center gap-2">
            {balance}
          </div>
        </div>
      </div>

      <form onSubmit={handleWithdrawSubmit} className="space-y-5">
        {withdrawError && (
          <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-xl text-xs font-semibold text-center">
            {withdrawError}
          </div>
        )}

        <div className="text-left space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Nominal Penarikan
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 font-bold text-zinc-500">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 outline-none text-lg font-bold transition-all focus:border-zinc-500 placeholder:text-zinc-700 disabled:opacity-50"
              placeholder="0"
              value={withdrawAmount}
              onChange={handleAmountChange}
              required
              disabled={withdrawLoading}
            />
          </div>
        </div>

        <div className="text-left space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Tujuan Transfer
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 outline-none text-sm font-bold transition-all focus:border-zinc-500 appearance-none disabled:opacity-50"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <BankIcon size={18} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
          disabled={withdrawLoading || !withdrawAmount}
        >
          {withdrawLoading ? (
            <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            'Tarik Saldo Sekarang'
          )}
        </button>
      </form>
    </div>
  );
}
