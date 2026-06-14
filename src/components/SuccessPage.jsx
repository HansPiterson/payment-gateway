import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { parseQris } from '../lib/qris';
import { Copy01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';

export default function SuccessPage({ paymentData, customer, service }) {
  const confettiRef = useRef(false);

  const [copied, setCopied] = useState(false);

  const hasQris = !!(paymentData?.qris_content || paymentData?.qris_url);
  const qrisInfo = hasQris ? parseQris(paymentData.qris_content) : {};
  const merchantName = qrisInfo['59'] || 'Bayar GG';
  const rawQrisAmount = qrisInfo['54'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopy = () => {
    if (paymentData?.invoice_id) {
      navigator.clipboard.writeText(paymentData.invoice_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Confetti effect (Monochrome grey scale)
  useEffect(() => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    const colors = ['#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#3f3f46'];
    const container = document.body;

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.position = 'fixed';
      piece.style.top = '-10px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.width = Math.random() * 6 + 4 + 'px';
      piece.style.height = Math.random() * 6 + 4 + 'px';
      piece.style.zIndex = '9999';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);

      // Clean up after animation
      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto text-center animate-fade-in font-sans">
      <div className="bg-zinc-900 border-[0.5px] border-zinc-800 rounded-xl p-6 md:p-8 shadow-none">
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden">
          <DotLottieReact
            src="https://lottie.host/83b30e2a-0edb-4762-a333-93b7a889e810/dvBt3kYw1x.lottie"
            autoplay
            loop={false}
          />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">Pembayaran Berhasil!</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
          Terima kasih. Pembayaran Anda telah kami terima.
        </p>

        <div className="my-8 bg-zinc-950 border-[0.5px] border-zinc-850 rounded-xl p-4 space-y-3 text-sm text-left font-sans">
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Invoice ID</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-zinc-200 bg-zinc-900 border-[0.5px] border-zinc-800 px-2 py-0.5 rounded">
                {paymentData?.invoice_id || '-'}
              </span>
              <button onClick={handleCopy} className="text-zinc-400 hover:text-zinc-200 transition-colors" title="Salin Invoice ID">
                {copied ? <CheckmarkCircle01Icon size={14} className="text-green-500" /> : <Copy01Icon size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Layanan</span>
            <span className="font-medium text-zinc-200">{merchantName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Jumlah</span>
            <span className="font-bold text-zinc-100">{rawQrisAmount ? formatPrice(Number(rawQrisAmount)) : formatPrice(service?.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Metode</span>
            <span className="font-medium text-zinc-200 uppercase">{paymentData?.iqris_payment_methodby || paymentData?.payment_method || paymentData?.paid_via || 'QRIS'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Status</span>
            <span className="bg-zinc-800 border-[0.5px] border-zinc-700 text-zinc-100 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider">
              PAID
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Deskripsi</span>
            <span className="text-zinc-200 font-medium truncate max-w-[180px]">{paymentData?.description || service?.name || '-'}</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed mb-4 max-w-sm mx-auto font-light">
          Detail Transaksi ini sudah sah silahkan hubungi admin jika ada pertanyaan.
        </p>


      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
