import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ['Umum', 'Sosial', 'Bencana', 'Pendidikan', 'Agama', 'Medis', 'Lainnya'];

export default function CreateCampaign({ onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Umum',
    donation_type: 'free',
    fixed_amounts: '',
    target_amount: '',
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file, pathPrefix) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `campaigns/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('campaigns')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('campaigns').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (formData.donation_type === 'fixed') {
        const amounts = formData.fixed_amounts.split(',').map(a => parseInt(a.trim(), 10));
        if (amounts.some(isNaN)) throw new Error('Format nominal pilihan tidak valid. Gunakan angka dan koma.');
        if (amounts.some(a => a < 2000 || a > 500000)) throw new Error('Pilihan nominal harus antara Rp 2.000 dan Rp 500.000');
      }

      if (formData.target_amount) {
        const target = parseInt(formData.target_amount, 10);
        if (target < 10000 || target > 1000000) {
          throw new Error('Target donasi (jika diisi) harus antara Rp 10.000 dan Rp 1.000.000');
        }
      }

      // Upload Images
      const banner_url = await uploadFile(bannerFile, 'banner');
      const logo_url = await uploadFile(logoFile, 'logo');

      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        donation_type: formData.donation_type,
        banner_url,
        logo_url,
        fixed_amounts: formData.donation_type === 'fixed' 
          ? formData.fixed_amounts.split(',').map(a => parseInt(a.trim(), 10))
          : null,
        target_amount: formData.target_amount ? parseInt(formData.target_amount, 10) : null,
      };

      const { error: insertError } = await supabase.from('campaigns').insert(payload);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-left">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        ← Kembali
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Buat Link Donasi Baru</h2>
          <p className="text-sm text-zinc-400 mt-1">Siapkan kampanye penggalangan dana Anda</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 p-4 rounded-lg text-sm mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-zinc-850 rounded-xl bg-zinc-950/50">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Banner Gambar (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-2">Rasio 16:9 direkomendasikan</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Logo (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-2">Rasio 1:1 direkomendasikan</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Judul Donasi *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                placeholder="Contoh: Bantuan Banjir Bandang"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Target Donasi (Rupiah, Opsional)</label>
                <input
                  type="number"
                  name="target_amount"
                  min="10000"
                  max="1000000"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors"
                  placeholder="Maks. 1.000.000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deskripsi (Opsional)</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 focus:border-zinc-500 transition-colors"
                placeholder="Ceritakan tujuan donasi ini..."
              />
            </div>
          </div>

          {/* Type Section */}
          <div className="p-5 border border-zinc-850 rounded-xl bg-zinc-950/50 space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipe Nominal Donasi *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="donation_type"
                  value="free"
                  checked={formData.donation_type === 'free'}
                  onChange={handleInputChange}
                  className="accent-zinc-400 w-4 h-4"
                />
                <span className={formData.donation_type === 'free' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}>Bebas Nominal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="donation_type"
                  value="fixed"
                  checked={formData.donation_type === 'fixed'}
                  onChange={handleInputChange}
                  className="accent-zinc-400 w-4 h-4"
                />
                <span className={formData.donation_type === 'fixed' ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}>Pilihan Nominal</span>
              </label>
            </div>

            {formData.donation_type === 'free' ? (
              <p className="text-xs text-zinc-500 mt-2">Donatur dapat memasukkan nominal sendiri (Min: Rp 1.000, Max: Rp 500.000).</p>
            ) : (
              <div className="mt-4">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pilihan Nominal (Pisahkan dengan koma) *</label>
                <input
                  type="text"
                  name="fixed_amounts"
                  required
                  value={formData.fixed_amounts}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 focus:border-zinc-400 transition-colors"
                  placeholder="Contoh: 10000, 50000, 100000"
                />
                <p className="text-[10px] text-zinc-500 mt-1.5">Min: Rp 2.000, Max: Rp 500.000 per pilihan.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-850">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Buat Link Donasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
