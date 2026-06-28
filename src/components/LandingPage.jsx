import { useState, useEffect } from 'react';
import {
  ArrowRight01Icon,
  Sun01Icon,
  Moon01Icon,
  SparklesIcon,
  QrCode01Icon,
  FavouriteIcon,
  Wallet01Icon,
  ChartLineData02Icon,
  SourceCodeIcon,
  ShieldEnergyIcon,
  Tick02Icon,
  CheckmarkCircle02Icon,
  Menu01Icon,
  Cancel01Icon,
  Link01Icon,
  ArrowDown01Icon,
} from 'hugeicons-react';

const LOGO = 'https://res.cloudinary.com/dryrjot5c/image/upload/f_auto,q_auto/extension_icon_21_wuobgt';

const navLinks = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Harga', href: '#harga' },
  { label: 'FAQ', href: '#faq' },
];

const paymentMethods = ['QRIS', 'GoPay', 'DANA', 'OVO', 'ShopeePay', 'm-Banking', 'LinkAja'];

const stats = [
  { value: 'Rp 4,2M+', label: 'Volume transaksi diproses' },
  { value: '99.98%', label: 'Uptime layanan' },
  { value: '< 5 dtk', label: 'Pembuatan link pembayaran' },
  { value: '12.000+', label: 'Merchant & kreator aktif' },
];

const features = [
  {
    Icon: QrCode01Icon,
    title: 'Payment Link QRIS Instan',
    desc: 'Buat tautan pembayaran QRIS yang bisa dibayar lewat semua e-wallet dan m-Banking, tanpa integrasi rumit.',
    wide: true,
  },
  {
    Icon: FavouriteIcon,
    title: 'Kampanye Donasi',
    desc: 'Galang dana dengan halaman donasi transparan, progress bar, dan pesan dukungan dari donatur.',
  },
  {
    Icon: Wallet01Icon,
    title: 'Pencairan Saldo',
    desc: 'Tarik saldo langsung ke rekening bank Anda kapan saja dengan proses yang cepat dan aman.',
  },
  {
    Icon: ChartLineData02Icon,
    title: 'Analitik Real-time',
    desc: 'Pantau pendapatan, status transaksi, dan performa lewat dasbor yang ringkas dan mudah dibaca.',
  },
  {
    Icon: SourceCodeIcon,
    title: 'API Developer',
    desc: 'Integrasikan pembayaran ke produk Anda dengan REST API yang sederhana dan terdokumentasi.',
  },
  {
    Icon: ShieldEnergyIcon,
    title: 'Keamanan Tingkat Bank',
    desc: 'Enkripsi end-to-end, pemantauan fraud, dan kepatuhan standar industri untuk setiap transaksi.',
    wide: true,
  },
];

const steps = [
  {
    no: '01',
    title: 'Buat akun gratis',
    desc: 'Daftar hanya dengan email dalam hitungan detik. Tidak perlu kartu kredit untuk memulai.',
  },
  {
    no: '02',
    title: 'Buat link pembayaran',
    desc: 'Tentukan nominal dan deskripsi, lalu bagikan tautan QRIS Anda ke pelanggan atau donatur.',
  },
  {
    no: '03',
    title: 'Terima & cairkan dana',
    desc: 'Pantau pembayaran masuk secara real-time dan tarik saldo ke rekening Anda kapan saja.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Gratis',
    note: 'Selamanya',
    desc: 'Untuk individu & kreator yang baru memulai.',
    features: ['Payment link tanpa batas', 'Halaman donasi', 'Dasbor analitik dasar', 'Biaya 0,7% per transaksi'],
    cta: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Growth',
    price: 'Rp 149rb',
    note: '/bulan',
    desc: 'Untuk bisnis yang sedang berkembang pesat.',
    features: ['Semua fitur Starter', 'Akses penuh API developer', 'Analitik lanjutan & ekspor', 'Biaya 0,4% per transaksi', 'Dukungan prioritas'],
    cta: 'Coba Growth',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Kustom',
    note: 'Hubungi kami',
    desc: 'Untuk perusahaan dengan volume tinggi.',
    features: ['Semua fitur Growth', 'Settlement harian khusus', 'SLA & manajer akun khusus', 'Harga transaksi negosiasi', 'Onboarding terkelola'],
    cta: 'Hubungi Sales',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'Apakah BAYAR.dev gratis untuk digunakan?',
    a: 'Ya. Paket Starter gratis selamanya tanpa biaya bulanan. Anda hanya dikenakan biaya kecil per transaksi yang berhasil. Tidak ada biaya tersembunyi.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Semua pembayaran menggunakan QRIS, sehingga pelanggan dapat membayar lewat GoPay, DANA, OVO, ShopeePay, LinkAja, hingga m-Banking dari bank mana pun.',
  },
  {
    q: 'Berapa lama proses pencairan saldo?',
    a: 'Pencairan saldo ke rekening bank Anda umumnya diproses dalam hitungan jam pada hari kerja, tergantung kebijakan bank tujuan.',
  },
  {
    q: 'Apakah ada API untuk developer?',
    a: 'Tentu. Kami menyediakan REST API yang terdokumentasi lengkap sehingga Anda dapat membuat dan memantau pembayaran langsung dari aplikasi Anda.',
  },
  {
    q: 'Seberapa aman transaksi di BAYAR.dev?',
    a: 'Kami menerapkan enkripsi end-to-end, pemantauan fraud otomatis, dan mematuhi standar keamanan industri untuk melindungi setiap transaksi dan data Anda.',
  },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
      <span className="w-5 h-px bg-zinc-400 dark:bg-zinc-600" />
      {children}
    </span>
  );
}

export default function LandingPage({ isDarkMode, toggleTheme, onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased w-full overflow-x-hidden">
      {/* ───── Header ───── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/70'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
              <img src={LOGO} alt="BAYAR.dev" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">BAYAR.dev</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Ganti tema"
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun01Icon size={18} /> : <Moon01Icon size={18} />}
            </button>
            <button
              onClick={onLogin}
              className="hidden sm:inline-flex py-2 px-4 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-1.5 py-2 px-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-lg text-sm transition-colors shadow-sm"
            >
              Daftar
              <ArrowRight01Icon size={15} />
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={onLogin}
                className="mt-2 py-2.5 px-3 text-left rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                Masuk
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ───── Hero ───── */}
      <section className="relative">
        <div className="absolute inset-0 bg-grid mask-fade pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold tracking-wide shadow-sm">
              <SparklesIcon size={14} className="text-zinc-500 dark:text-zinc-400" />
              <span>Platform pembayaran enterprise untuk Indonesia</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.05] text-balance">
              Terima pembayaran &amp; donasi hanya dengan satu tautan.
            </h1>

            <p className="mt-5 text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">
              BAYAR.dev menghadirkan pemrosesan dana modern tanpa birokrasi integrasi.
              Buat link pembayaran QRIS otomatis atau galang dana lewat kampanye donasi transparan dalam hitungan detik.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRegister}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg group"
              >
                Mulai sekarang — gratis
                <ArrowRight01Icon size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 font-bold rounded-xl text-sm transition-all"
              >
                Masuk ke dasbor
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckmarkCircle02Icon size={15} className="text-zinc-700 dark:text-zinc-300" /> Tanpa kartu kredit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckmarkCircle02Icon size={15} className="text-zinc-700 dark:text-zinc-300" /> Aktif dalam 2 menit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckmarkCircle02Icon size={15} className="text-zinc-700 dark:text-zinc-300" /> Mendukung semua e-wallet
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:pl-6">
            <div className="relative mx-auto w-full max-w-md">
              {/* Main payment card */}
              <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                      <img src={LOGO} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-sm font-bold">Pembayaran QRIS</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                    Menunggu
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                    <QrCode01Icon size={104} className="text-zinc-900 dark:text-zinc-100" strokeWidth={1.4} />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total tagihan</p>
                  <p className="text-3xl font-black tracking-tight">Rp 250.000</p>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-2">
                  {['GoPay', 'DANA', 'OVO', 'Shopee'].map((m) => (
                    <div
                      key={m}
                      className="text-center text-[10px] font-bold py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating success chip */}
              <div className="absolute -top-5 -left-4 sm:-left-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950">
                  <CheckmarkCircle02Icon size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Pembayaran diterima</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Baru saja • Rp 250.000</p>
                </div>
              </div>

              {/* Floating mini stat */}
              <div className="absolute -bottom-6 -right-3 sm:-right-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl px-4 py-3 animate-in fade-in slide-in-from-right-4 duration-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Hari ini</p>
                <p className="text-lg font-black tracking-tight">Rp 8,2jt</p>
                <div className="mt-1.5 flex items-end gap-1 h-7">
                  {[40, 65, 45, 80, 60, 95, 75].map((h, i) => (
                    <span key={i} className="w-1.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Trust / payment methods ───── */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 flex-shrink-0">
            Mendukung semua metode
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {paymentMethods.map((m) => (
              <span key={m} className="text-sm font-extrabold text-zinc-400 dark:text-zinc-500 tracking-tight">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {stats.map((s) => (
            <div key={s.label} className="bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8 text-center">
              <p className="text-2xl md:text-4xl font-black tracking-tight">{s.value}</p>
              <p className="mt-2 text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 text-balance">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="fitur" className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24 scroll-mt-20">
        <div className="max-w-2xl">
          <SectionLabel>Fitur</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-balance">
            Semua yang Anda butuhkan untuk menerima uang.
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 text-pretty">
            Dari payment link hingga kampanye donasi dan API developer — dirancang agar sederhana, cepat, dan dapat diandalkan.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 md:p-7 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg ${
                f.wide ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center mb-5 transition-transform group-hover:scale-105">
                <f.Icon size={22} />
              </div>
              <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="cara-kerja" className="border-y border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <SectionLabel>Cara kerja</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-balance">
              Mulai menerima pembayaran dalam tiga langkah.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div key={s.no} className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7">
                <span className="text-5xl font-black text-zinc-200 dark:text-zinc-800 tracking-tight">{s.no}</span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section id="harga" className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24 scroll-mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>Harga</SectionLabel>
          <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-balance">
            Harga transparan, tanpa biaya tersembunyi.
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 text-pretty">
            Mulai gratis dan tingkatkan saat bisnis Anda bertumbuh. Anda hanya membayar untuk transaksi yang berhasil.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 items-start">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-7 border transition-all ${
                p.highlight
                  ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-2xl md:-translate-y-3'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">{p.name}</h3>
                {p.highlight && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 dark:bg-zinc-900/10 text-zinc-100 dark:text-zinc-900">
                    Populer
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight">{p.price}</span>
                <span className={`text-sm font-medium ${p.highlight ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {p.note}
                </span>
              </div>
              <p className={`mt-3 text-sm ${p.highlight ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
                {p.desc}
              </p>

              <button
                onClick={onRegister}
                className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                  p.highlight
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800'
                    : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                }`}
              >
                {p.cta}
              </button>

              <ul className="mt-7 space-y-3">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <Tick02Icon
                      size={17}
                      className={`mt-0.5 flex-shrink-0 ${p.highlight ? 'text-zinc-100 dark:text-zinc-900' : 'text-zinc-900 dark:text-zinc-100'}`}
                    />
                    <span className={p.highlight ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-700 dark:text-zinc-300'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-balance">
              Pertanyaan yang sering diajukan.
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-1 open:shadow-md transition-all"
              >
                <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-bold text-sm md:text-base">
                  <span>{f.q}</span>
                  <ArrowDown01Icon
                    size={18}
                    className="flex-shrink-0 text-zinc-500 dark:text-zinc-400 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 sm:px-12 py-14 md:py-20 text-center">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-balance">
              Siap menerima pembayaran pertama Anda?
            </h2>
            <p className="mt-4 text-base md:text-lg text-zinc-300 dark:text-zinc-600 max-w-xl mx-auto text-pretty">
              Bergabung dengan ribuan merchant dan kreator. Buat akun gratis dan buat link pembayaran pertama Anda hari ini.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onRegister}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 font-bold rounded-xl text-sm transition-colors shadow-lg group"
              >
                Mulai gratis sekarang
                <ArrowRight01Icon size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 border border-zinc-700 dark:border-zinc-300 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold rounded-xl text-sm transition-colors"
              >
                Masuk ke akun
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                  <img src={LOGO} alt="BAYAR.dev" className="w-5 h-5 object-contain" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">BAYAR.dev</span>
              </a>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                Platform pembayaran &amp; donasi modern untuk merchant, kreator, dan developer di Indonesia.
              </p>
            </div>

            {[
              { title: 'Produk', links: ['Payment Link', 'Donasi', 'Analitik', 'API Developer'] },
              { title: 'Perusahaan', links: ['Tentang', 'Blog', 'Karier', 'Kontak'] },
              { title: 'Sumber Daya', links: ['Dokumentasi', 'Status', 'Kebijakan Privasi', 'Syarat Layanan'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} BAYAR.dev. Seluruh hak cipta dilindungi.</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
              <Link01Icon size={14} /> Dibuat untuk pembayaran tanpa ribet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
