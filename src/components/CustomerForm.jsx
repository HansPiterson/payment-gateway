import { useState } from 'react';

export default function CustomerForm({ onSubmit, onBack, initialData }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!form.email.trim()) {
      errs.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[\d+\-\s()]{8,}$/.test(form.phone)) {
      errs.phone = 'Nomor telepon tidak valid';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-left">
      <button
        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-450 hover:text-zinc-100 mb-6 transition-colors"
        onClick={onBack}
        type="button"
      >
        ← Kembali
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Data Diri</h2>
          <p className="text-xs text-zinc-450 mt-1">Lengkapi informasi untuk proses pembayaran</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              className={`w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-150 border outline-none text-sm transition-all focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 ${
                errors.name ? 'border-zinc-500' : 'border-zinc-850'
              }`}
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoComplete="name"
            />
            {errors.name && <p className="text-[11px] text-zinc-400 italic mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2" htmlFor="customer-email">
              Email
            </label>
            <input
              id="customer-email"
              className={`w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-150 border outline-none text-sm transition-all focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 ${
                errors.email ? 'border-zinc-500' : 'border-zinc-850'
              }`}
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className="text-[11px] text-zinc-400 italic mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2" htmlFor="customer-phone">
              Nomor Telepon
            </label>
            <input
              id="customer-phone"
              className={`w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-150 border outline-none text-sm transition-all focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 ${
                errors.phone ? 'border-zinc-500' : 'border-zinc-850'
              }`}
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-[11px] text-zinc-400 italic mt-1.5">{errors.phone}</p>}
          </div>

          <button
            className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-1.5 mt-2"
            type="submit"
            id="btn-continue-payment"
          >
            Lanjut ke Pembayaran →
          </button>
        </form>
      </div>
    </div>
  );
}
