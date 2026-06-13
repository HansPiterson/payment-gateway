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
    <div className="animate-slide-in">
      <button className="btn-back" onClick={onBack} type="button">
        ← Kembali
      </button>

      <div className="glass-card">
        <div className="glass-card-header">
          <h2 className="glass-card-title">Data Diri</h2>
          <p className="glass-card-subtitle">
            Lengkapi informasi untuk proses pembayaran
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoComplete="name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-email">
              Email
            </label>
            <input
              id="customer-email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-phone">
              Nomor Telepon
            </label>
            <input
              id="customer-phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              autoComplete="tel"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <button className="btn-primary" type="submit" id="btn-continue-payment">
            Lanjut ke Pembayaran →
          </button>
        </form>
      </div>
    </div>
  );
}
