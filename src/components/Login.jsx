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
    } catch (err) {
      console.error('Login error:', err);
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
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Soft iOS-like mesh gradient background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 animate-fade-in">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-foreground flex items-center justify-center text-background shadow-lg mb-6 ios-shadow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1 className="text-3xl text-foreground tracking-tight mb-2">Login</h1>
          <p className="text-[15px] text-muted-foreground font-medium">Masuk untuk mengelola BAYAR.dev</p>
        </div>

        {/* Login Form Card - Apple Style */}
        <div className="glass-panel rounded-[2rem] p-8 relative">
          
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-2xl text-[13px] font-semibold flex items-center gap-3 animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                ✕
              </div>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail01Icon size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary border-transparent text-foreground text-[15px] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-ios placeholder:text-muted-foreground"
                  placeholder="Email"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <SquareLock02Icon size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary border-transparent text-foreground text-[15px] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-ios placeholder:text-muted-foreground"
                  placeholder="Password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full active:scale-[0.97] transition-ios disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group ios-shadow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-[17px]">Masuk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-[13px] text-muted-foreground mt-8 font-medium">
          Protected by Supabase Auth
        </p>
      </div>
    </div>
  );
}
