import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, FUNCTIONS_URL, supabaseAnonKey } from '../lib/supabase';
import { parseQris } from '../lib/qris';

const CHECKOUT_KEY = 'chk_62c780a4f4510faa53476b14abb4faefc8fa7f9bbe7e605d';

export default function PaymentStep({ service, customer, onSuccess, onBack, initialPaymentData }) {
  const [state, setState] = useState('creating'); // creating | ready | paid | error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [checkingManually, setCheckingManually] = useState(false);
  const embedContainerRef = useRef(null);
  const subscriptionRef = useRef(null);

  const hasQris = !!(paymentData?.qris_content || paymentData?.qris_url);
  const qrisInfo = hasQris ? parseQris(paymentData.qris_content) : {};
  const merchantName = qrisInfo['59'] || 'BAYAR.DEV';
  const rawQrisAmount = qrisInfo['54']; // Tag 54 is Transaction Amount

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Create payment via edge function
  const createPayment = useCallback(async () => {
    try {
      setState('creating');
      setError('');

      const response = await fetch(`${FUNCTIONS_URL}/create-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          amount: service.price,
          description: `${service.name} — BAYAR.dev`,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const payData = result.data || result;
      // Add a fallback created_at if missing
      if (!payData.created_at) payData.created_at = new Date().toISOString();
      setPaymentData(payData);
      setState('ready');

      // Subscribe to realtime updates
      subscribeToPayment(payData.invoice_id);
    } catch (err) {
      console.error('Create payment error:', err);
      setError(err.message || 'Gagal membuat pembayaran. Silakan coba lagi.');
      setState('error');
    }
  }, [service, customer]);

  // Subscribe to Supabase Realtime for payment status changes
  const subscribeToPayment = useCallback((invoiceId) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const channel = supabase
      .channel(`payment-${invoiceId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `invoice_id=eq.${invoiceId}`,
        },
        (payload) => {
          const newStatus = payload.new?.status;
          if (newStatus === 'paid' || newStatus === 'success') {
            setState('paid');
            setTimeout(() => onSuccess(payload.new), 1500);
          } else if (newStatus === 'expired' || newStatus === 'cancelled') {
            setState('expired');
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  }, [onSuccess]);

  // Manual status check fallback
  const checkManually = async () => {
    if (!paymentData?.invoice_id || checkingManually) return;

    setCheckingManually(true);
    try {
      const response = await fetch(
        `${FUNCTIONS_URL}/check-payment?invoice_id=${paymentData.invoice_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
          }
        }
      );
      const result = await response.json();
      const payData = result.data || result;

      if (payData.status === 'paid' || payData.status === 'success') {
        setState('paid');
        setTimeout(() => onSuccess(payData), 1500);
      } else if (payData.status === 'expired' || payData.status === 'cancelled') {
        setState('expired');
      }
    } catch (err) {
      console.error('Manual check error:', err);
    } finally {
      setCheckingManually(false);
    }
  };

  const [timeLeft, setTimeLeft] = useState(null);

  // Expiration and countdown logic
  useEffect(() => {
    if (state !== 'ready' || !paymentData?.created_at) return;

    const calculateTimeLeft = () => {
      let dateStr = paymentData.created_at;
      // Normalisasi format date ke UTC jika backend kehilangan offset (Z)
      if (typeof dateStr === 'string') {
        dateStr = dateStr.replace(" ", "T");
        if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)) {
          dateStr += 'Z';
        }
      }

      const createdTime = new Date(dateStr).getTime();
      const expireTime = createdTime + 24 * 60 * 60 * 1000; // 24 hours
      const now = new Date().getTime();
      const difference = expireTime - now;

      if (difference <= 0) {
        setState('expired');
        setTimeLeft('00:00:00');
        return false; // stopped
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      return true; // continue
    };

    // Run initially
    const isActive = calculateTimeLeft();
    if (!isActive) return;

    const timer = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [state, paymentData]);

  // Load Bayar.gg pay.js embed when payment is ready
  useEffect(() => {
    if (state !== 'ready' || hasQris || !paymentData?.invoice_id || !embedContainerRef.current) return;

    const container = embedContainerRef.current;
    // Clear any existing content
    container.innerHTML = '';

    // Build the checkout URL
    const checkoutUrl = new URL('https://www.bayar.gg/pay');
    checkoutUrl.searchParams.set('invoice', paymentData.invoice_id);
    checkoutUrl.searchParams.set('embed', '1');
    checkoutUrl.searchParams.set('checkout_key', CHECKOUT_KEY);

    // Create iframe for embedded checkout
    const iframe = document.createElement('iframe');
    iframe.src = checkoutUrl.toString();
    iframe.style.width = '100%';
    iframe.style.minHeight = '420px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = 'Bayar.gg Checkout';

    container.appendChild(iframe);

    // Listen for postMessage from Bayar.gg
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.bayar.gg') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.status === 'paid' || data.type === 'payment_success' || data.status === 'success') {
          setState('paid');
          setTimeout(() => onSuccess(paymentData), 1500);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [state, paymentData, onSuccess]);

  // Create payment on mount
  useEffect(() => {
    if (initialPaymentData) {
      setPaymentData(initialPaymentData);
      setState('ready');
      subscribeToPayment(initialPaymentData.invoice_id);
    } else {
      createPayment();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [initialPaymentData, createPayment, subscribeToPayment]);

  return (
    <div className="w-full max-w-[440px] mx-auto text-left">
      {onBack && (
        <button
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary/80 mb-4 transition-ios active:scale-95"
          onClick={onBack}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali
        </button>
      )}

      <div className="glass-panel rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        <div className="mb-8 text-center mt-2">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary stroke-[2.5px] stroke-linecap-round stroke-linejoin-round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Pembayaran</h2>
          <p className="text-[13px] text-muted-foreground mt-1.5">Scan QRIS untuk menyelesaikan pembayaran</p>
        </div>

        {/* Order Summary (Apple Pay Sheet Style) */}
        <div className="bg-secondary/40 border border-border/50 rounded-2xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center bg-secondary/20">
            <span className="text-[12px] font-medium text-muted-foreground">MERCHANT</span>
            <span className="text-[13px] font-bold text-foreground">{hasQris ? merchantName : 'BAYAR.DEV'}</span>
          </div>
          <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center">
            <span className="text-[12px] font-medium text-muted-foreground">DESKRIPSI</span>
            <span className="text-[13px] font-semibold text-foreground truncate max-w-[180px] text-right">{service.name}</span>
          </div>
          <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center">
            <span className="text-[12px] font-medium text-muted-foreground">PAYMENT ID</span>
            <span className="text-[13px] font-medium text-foreground opacity-80">{paymentData?.invoice_id || '-'}</span>
          </div>
          <div className="px-4 py-4 flex justify-between items-center bg-secondary/10">
            <span className="text-[14px] font-bold text-foreground">Total Bayar</span>
            <span className="text-[20px] font-black text-foreground tracking-tight">
              {rawQrisAmount ? formatPrice(Number(rawQrisAmount)) : formatPrice(service.price)}
            </span>
          </div>
        </div>

        {/* Payment States */}
        {state === 'creating' && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-8 h-8 border-3 border-muted border-t-foreground rounded-full animate-spin mb-4" />
            <span className="text-[14px] text-muted-foreground font-medium">Menyiapkan pembayaran...</span>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-[13px] text-muted-foreground mb-6 max-w-[260px] mx-auto leading-relaxed">
              {error}
            </p>
            <button
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-[1.25rem] transition-ios text-[15px] shadow-sm active:scale-[0.98]"
              onClick={createPayment}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {state === 'ready' && (
          <div className="space-y-6 animate-fade-in">
            {hasQris ? (
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-[1.5rem] shadow-sm">
                {/* QR Code Container */}
                <div className="p-2 mb-3 flex items-center justify-center w-[200px] h-[200px] overflow-hidden">
                  <img
                    src={
                      paymentData.qris_content
                        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&color=000000&bgcolor=FFFFFF&data=${encodeURIComponent(paymentData.qris_content)}`
                        : paymentData.qris_url
                    }
                    alt="QRIS Code"
                    className="w-full h-full object-contain select-none"
                    draggable="false"
                  />
                </div>
                
                {/* QRIS branding header */}
                <div className="flex items-center justify-center gap-1.5 w-full mt-2">
                  <span className="text-red-600 font-extrabold text-[15px] tracking-widest">QRIS</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">GPN</span>
                </div>
              </div>
            ) : (
              <div className="border border-border/50 rounded-[1.5rem] overflow-hidden bg-background p-2">
                <div ref={embedContainerRef} className="w-full" />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl bg-secondary/50 border border-border text-[13px] font-medium text-foreground">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                <span className="text-muted-foreground">Menunggu pembayaran...</span>
              </div>
              {timeLeft && (
                <div className="font-mono text-foreground font-bold bg-background px-2 py-1 rounded-md shadow-sm border border-border/50">
                  {timeLeft}
                </div>
              )}
            </div>
          </div>
        )}

        {state === 'paid' && (
          <div className="flex flex-col items-center justify-center py-10 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">PEMBAYARAN BERHASIL!</span>
          </div>
        )}

        {state === 'expired' && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground mx-auto mb-5 shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Waktu Habis</h3>
            <p className="text-[13px] text-muted-foreground mb-6 max-w-[280px] mx-auto leading-relaxed">
              Waktu pembayaran untuk tautan ini sudah habis, atau pembayaran dibatalkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
