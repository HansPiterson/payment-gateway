import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, FUNCTIONS_URL, supabaseAnonKey } from '../lib/supabase';

const CHECKOUT_KEY = 'chk_62c780a4f4510faa53476b14abb4faefc8fa7f9bbe7e605d';

export default function PaymentStep({ service, customer, onSuccess, onBack, initialPaymentData }) {
  const [state, setState] = useState('creating'); // creating | ready | paid | error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [checkingManually, setCheckingManually] = useState(false);
  const embedContainerRef = useRef(null);
  const subscriptionRef = useRef(null);

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
      }
    } catch (err) {
      console.error('Manual check error:', err);
    } finally {
      setCheckingManually(false);
    }
  };

  // Load Bayar.gg pay.js embed when payment is ready
  useEffect(() => {
    if (state !== 'ready' || !paymentData?.invoice_id || !embedContainerRef.current) return;

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
          <h2 className="text-xl font-bold text-zinc-100">Pembayaran</h2>
          <p className="text-xs text-zinc-450 mt-1">Scan QRIS untuk menyelesaikan pembayaran</p>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2.5 mb-6 text-sm">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Ringkasan Pesanan</div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>{service.name}</span>
            <span className="font-semibold text-zinc-200">{formatPrice(service.price)}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Nama Customer</span>
            <span className="font-semibold text-zinc-200 truncate max-w-[150px]">{customer.name}</span>
          </div>
          <div className="h-px bg-zinc-850 my-1" />
          <div className="flex justify-between items-center font-bold text-zinc-100 text-base">
            <span>Total Bayar</span>
            <span className="font-extrabold">{formatPrice(service.price)}</span>
          </div>
        </div>

        {/* Payment States */}
        {state === 'creating' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-8 h-8 border-3 border-zinc-800 border-t-zinc-200 rounded-full animate-spin mb-4" />
            <span className="text-sm text-zinc-400 font-semibold">Membuat invoice pembayaran...</span>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xl font-bold mx-auto mb-4">
              ✕
            </div>
            <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto leading-relaxed">
              {error}
            </p>
            <button
              className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-sm shadow-sm max-w-[200px] mx-auto block"
              onClick={createPayment}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {state === 'ready' && (
          <div className="space-y-4">
            <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950 p-2">
              <div ref={embedContainerRef} className="w-full" />
            </div>

            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-zinc-950 border border-zinc-855 text-zinc-400 text-xs font-semibold">
              <div className="w-3.5 h-3.5 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
              Menunggu pembayaran Anda...
            </div>

            <button
              className="w-full py-2.5 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-2"
              onClick={checkManually}
              disabled={checkingManually}
              id="btn-check-manual"
            >
              <svg className={`w-3.5 h-3.5 ${checkingManually ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              {checkingManually ? 'Memeriksa status...' : 'Cek Status Pembayaran Manual'}
            </button>
          </div>
        )}

        {state === 'paid' && (
          <div className="flex flex-col items-center justify-center py-10 bg-zinc-100 text-zinc-950 rounded-xl font-bold shadow-md animate-pulse">
            <svg className="w-10 h-10 mb-2 stroke-zinc-950" fill="none" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-lg font-black tracking-wide">PEMBAYARAN BERHASIL!</span>
          </div>
        )}
      </div>
    </div>
  );
}
