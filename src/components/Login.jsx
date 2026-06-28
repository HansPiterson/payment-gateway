import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Mail01Icon,
  SquareLock02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Sun01Icon,
  Moon01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from 'hugeicons-react';
import LandingPage from './LandingPage';

const LOGO = 'https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt';

const authHighlights = [
  'Payment link QRIS instan tanpa integrasi rumit',
  'Kampanye donasi transparan dengan progress bar',
  'Pencairan saldo langsung ke rekening bank Anda',
  'Analitik transaksi real-time dalam satu dasbor',
];

export default function Login({ initialMode = 'landing', isDarkMode, toggleTheme }) {
  // mode: 'landing' | 'login' | 'register'
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const navigate = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    const path = newMode === 'register' ? '/register' : newMode === 'login' ? '/login' : '/';
    window.history.pushState({}, '', path);
    if (newMode === 'login' || newMode === 'register') {
      window.scrollTo(0, 0);
      setTimeout(() => emailInputRef.current?.focus(), 120);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error(signInError.message);
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw new Error(signUpError.message);

        setSuccess('Registrasi sukses! Silakan periksa email Anda untuk mengonfirmasi akun.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ───── Landing page ─────
  if (mode === 'landing') {
    return (
      <LandingPage
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onLogin={() => navigate('login')}
        onRegister={() => navigate('register')}
      />
    );
  }

  // ───── Auth screen ─────
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Left brand panel (desktop) */}
      <aside className="hidden lg:flex flex-col justify-between w-[44%] xl:w-[40%] bg-zinc-900 dark:bg-zinc-900 text-zinc-100 p-10 xl:p-14 relative overflow-hidden border-r border-zinc-800">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <button onClick={() => navigate('landing')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <img src={LOGO} alt="BAYAR.dev" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">BAYAR.dev</span>
          </button>
        </div>

        <div className="relative">
          <h2 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-balance">
            Terima pembayaran &amp; donasi hanya dengan satu tautan.
          </h2>
          <ul className="mt-8 space-y-4">
            {authHighlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center flex-shrink-0">
                  <CheckmarkCircle02Icon size={14} />
                </span>
                <span className="text-pretty">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} BAYAR.dev</span>
          <span>Pembayaran tanpa ribet</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex flex-col relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 h-16 flex-shrink-0">
          <button
            onClick={() => navigate('landing')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft01Icon size={16} />
            Beranda
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Ganti tema"
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun01Icon size={18} /> : <Moon01Icon size={18} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 pb-12">
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Mobile logo */}
            <button onClick={() => navigate('landing')} className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                <img src={LOGO} alt="BAYAR.dev" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">BAYAR.dev</span>
            </button>

            <div className="mb-7">
              <h1 className="text-2xl font-black tracking-tight">
                {isLogin ? 'Selamat datang kembali' : 'Buat akun baru'}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isLogin
                  ? 'Masuk untuk melanjutkan ke dasbor Anda.'
                  : 'Daftar gratis dan mulai menerima pembayaran.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-3.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 animate-in fade-in">
                <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0">
                  <Cancel01Icon size={14} />
                </span>
                <p className="flex-1">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-3.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 animate-in fade-in">
                <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0">
                  <CheckmarkCircle02Icon size={14} />
                </span>
                <p className="flex-1">{success}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-0.5" htmlFor="email">
                  Alamat email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Mail01Icon size={18} />
                  </span>
                  <input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    placeholder="email@perusahaan.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-0.5" htmlFor="password">
                  Kata sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <SquareLock02Icon size={18} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full mt-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Masuk ke dasbor' : 'Daftar sekarang'}</span>
                    <ArrowRight01Icon size={17} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {isLogin ? 'Belum memiliki akun? ' : 'Sudah memiliki akun? '}
              <button
                onClick={() => navigate(isLogin ? 'register' : 'login')}
                className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
