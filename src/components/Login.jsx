import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Mail01Icon, 
  SquareLock02Icon, 
  ArrowRight01Icon, 
  Sun01Icon, 
  Moon01Icon,
  BookOpen01Icon,
  SparklesIcon
} from 'hugeicons-react';

export default function Login({ initialMode = 'login', isDarkMode, toggleTheme }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    window.history.pushState({}, '', newMode === 'register' ? '/register' : '/login');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw new Error(signInError.message);
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
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

  const handleGetStartedClick = () => {
    handleModeChange('register');
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 relative overflow-hidden w-full">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-zinc-800/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-zinc-800/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Landing Header/Navbar */}
      <header className="sticky top-0 w-full z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-950 flex-shrink-0">
              <img src="https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              BAYAR.dev
            </span>
          </div>

          {/* Navigation links - Desktop only */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500 dark:text-zinc-450">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Harga</a>
            <a href="#docs" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Dokumentasi</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-lg transition-all"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun01Icon size={18} /> : <Moon01Icon size={18} />}
            </button>
            
            {mode === 'login' ? (
              <button 
                onClick={() => handleModeChange('register')}
                className="hidden sm:inline-flex py-2 px-4 bg-zinc-900 text-white dark:bg-zinc-150 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Daftar Akun
              </button>
            ) : (
              <button 
                onClick={() => handleModeChange('login')}
                className="hidden sm:inline-flex py-2 px-4 bg-zinc-900 text-white dark:bg-zinc-150 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Masuk Dasbor
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 w-full z-10">
        
        {/* Left Side: Product Explanation */}
        <div className="flex-1 text-left space-y-6 md:space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
            <SparklesIcon size={14} className="animate-pulse" />
            <span>Platform SAAS Finansial Enterprise</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Terima Pembayaran & Donasi Instan dalam Satu Tautan.
          </h2>

          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            BAYAR.dev menghadirkan solusi pemrosesan dana modern tanpa birokrasi integrasi yang berbelit. 
            Buat link pembayaran QRIS otomatis atau galang dana melalui kampanye donasi transparan dalam hitungan detik.
          </p>

          {/* Core Features list */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Payment Link Instan</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                  Generate tautan pembayaran QRIS instan untuk pelanggan e-wallet (GoPay, DANA, OVO, ShopeePay) dan m-Banking.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Penerimaan Donasi Publik</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                  Kelola donatur, pesan dukungan, progress bar pencapaian, dan sistem penarikan saldo (withdraw) langsung ke rekening Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleGetStartedClick}
              className="py-3.5 px-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-extrabold rounded-xl text-sm transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight01Icon size={16} />
            </button>
            <button
              onClick={() => alert('Fitur dokumentasi akan segera dikembangkan.')}
              className="py-3.5 px-6 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen01Icon size={16} />
              <span>Dokumentasi</span>
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="w-full max-w-[400px] flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative w-full">
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {mode === 'login' ? 'Masuk ke Dasbor' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 font-semibold">
                {mode === 'login' 
                  ? 'Gunakan email dan password terdaftar Anda.' 
                  : 'Registrasi instan untuk mencoba layanan finansial.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  ✕
                </div>
                <p className="flex-1">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-500/10 border border-green-250 dark:border-green-900/50 text-green-600 dark:text-green-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <p className="flex-1">{success}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider ml-1" htmlFor="email">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Mail01Icon size={18} />
                  </div>
                  <input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all placeholder:text-zinc-400"
                    placeholder="email@perusahaan.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wider ml-1" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <SquareLock02Icon size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all placeholder:text-zinc-400"
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
                className="w-full mt-6 py-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Masuk Dasbor' : 'Daftar Sekarang'}</span>
                    <ArrowRight01Icon size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Form Toggle Link */}
            <div className="mt-6 text-center text-xs">
              {mode === 'login' ? (
                <p className="text-zinc-500 dark:text-zinc-400 font-semibold">
                  Belum memiliki akun?{' '}
                  <button
                    onClick={() => handleModeChange('register')}
                    className="text-zinc-900 dark:text-zinc-200 hover:underline font-extrabold cursor-pointer"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              ) : (
                <p className="text-zinc-500 dark:text-zinc-400 font-semibold">
                  Sudah memiliki akun?{' '}
                  <button
                    onClick={() => handleModeChange('login')}
                    className="text-zinc-900 dark:text-zinc-200 hover:underline font-extrabold cursor-pointer"
                  >
                    Masuk Dasbor
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
