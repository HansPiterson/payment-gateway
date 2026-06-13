import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, FUNCTIONS_URL } from '../lib/supabase';

const CHECKOUT_KEY = 'chk_62c780a4f4510faa53476b14abb4faefc8fa7f9bbe7e605d';

export default function PaymentStep({ service, customer, onSuccess, onBack }) {
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
        headers: { 'Content-Type': 'application/json' },
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
        `${FUNCTIONS_URL}/check-payment?invoice_id=${paymentData.invoice_id}`
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
        if (data.status === 'paid' || data.status === 'success' || data.type === 'payment_success') {
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
    createPayment();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [createPayment]);

  return (
    <div className="animate-slide-in">
      <button className="btn-back" onClick={onBack} type="button">
        ← Kembali
      </button>

      <div className="glass-card">
        <div className="glass-card-header">
          <h2 className="glass-card-title">Pembayaran</h2>
          <p className="glass-card-subtitle">Scan QRIS untuk menyelesaikan pembayaran</p>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="order-summary-title">Ringkasan Pesanan</div>
          <div className="order-summary-row">
            <span className="order-summary-label">{service.name}</span>
            <span className="order-summary-value">{formatPrice(service.price)}</span>
          </div>
          <div className="order-summary-row">
            <span className="order-summary-label">Nama</span>
            <span className="order-summary-value">{customer.name}</span>
          </div>
          <div className="order-summary-row total">
            <span>Total</span>
            <span>{formatPrice(service.price)}</span>
          </div>
        </div>

        {/* Payment States */}
        {state === 'creating' && (
          <div className="loading-overlay">
            <div className="loading-spinner-lg" />
            <span className="loading-text">Membuat pembayaran...</span>
          </div>
        )}

        {state === 'error' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '24px'
            }}>
              ✕
            </div>
            <p style={{ color: 'var(--accent-red)', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </p>
            <button className="btn-primary" onClick={createPayment} style={{ maxWidth: '240px', margin: '0 auto' }}>
              Coba Lagi
            </button>
          </div>
        )}

        {state === 'ready' && (
          <>
            <div className="payment-embed-container" ref={embedContainerRef} />
            <div className="payment-status pending">
              <div className="spinner" />
              Menunggu pembayaran...
            </div>
            <button
              className="btn-secondary"
              onClick={checkManually}
              disabled={checkingManually}
              style={{ marginTop: '12px' }}
              id="btn-check-manual"
            >
              {checkingManually ? 'Mengecek...' : '🔄 Cek Status Manual'}
            </button>
          </>
        )}

        {state === 'paid' && (
          <div className="payment-status paid" style={{ flexDirection: 'column', padding: '30px' }}>
            <span style={{ fontSize: '32px', marginBottom: '8px' }}>✓</span>
            <span>Pembayaran Berhasil!</span>
          </div>
        )}
      </div>
    </div>
  );
}
