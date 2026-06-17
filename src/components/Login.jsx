import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail01Icon, SquareLock02Icon, ArrowRight01Icon } from 'hugeicons-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }
      
      // If success, App.jsx's onAuthStateChange listener will automatically hide this component
    } catch (err) {
      console.error('Login error:', err);
      // Simplify error message for user
      if (err.message.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError('Gagal masuk. Periksa koneksi internet Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-950 shadow-xl mb-6">
            <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Login Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-2 font-medium">Masuk untuk mengelola BAYAR.dev</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0">
                ✕
              </div>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <Mail01Icon size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-100 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-600"
                  placeholder="admin@bayar.dev"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <SquareLock02Icon size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-100 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-6 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dasbor</span>
                  <ArrowRight01Icon size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-zinc-600 mt-8 font-medium">
          Protected by <span className="text-zinc-400">Supabase Auth</span>
        </p>
      </div>
    </div>
  );
}
