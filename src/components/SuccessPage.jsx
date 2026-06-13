import { useEffect, useRef } from 'react';

export default function SuccessPage({ paymentData, customer, service }) {
  const confettiRef = useRef(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Confetti effect
  useEffect(() => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const container = document.body;

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
      piece.style.animationDelay = (Math.random() * 1.5) + 's';
      piece.style.width = (Math.random() * 6 + 4) + 'px';
      piece.style.height = (Math.random() * 6 + 4) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);

      // Clean up after animation
      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }, []);

  return (
    <div className="success-container">
      <div className="glass-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="success-title">Pembayaran Berhasil! 🎉</h2>
        <p className="success-subtitle">
          Terima kasih, {customer?.name}. Pembayaran Anda telah kami terima.
        </p>

        <div className="success-details">
          <div className="success-detail-row">
            <span className="success-detail-label">Invoice</span>
            <span className="success-detail-value" style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {paymentData?.invoice_id || '-'}
            </span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Layanan</span>
            <span className="success-detail-value">{service?.name}</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Jumlah</span>
            <span className="success-detail-value" style={{ color: 'var(--accent-green)' }}>
              {formatPrice(service?.price)}
            </span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Metode</span>
            <span className="success-detail-value">QRIS</span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Status</span>
            <span className="success-detail-value" style={{
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent-green)',
              padding: '2px 10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              PAID
            </span>
          </div>
          <div className="success-detail-row">
            <span className="success-detail-label">Email</span>
            <span className="success-detail-value">{customer?.email}</span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
          Detail transaksi telah dikirim ke <strong style={{ color: 'var(--text-secondary)' }}>{customer?.email}</strong>.
          Silakan hubungi kami jika ada pertanyaan.
        </p>

        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
          id="btn-new-payment"
        >
          Buat Pembayaran Baru
        </button>
      </div>
    </div>
  );
}
