import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PaymentStep from './PaymentStep';
import SuccessPage from './SuccessPage';

export default function DirectPayView({ payInvoiceId }) {
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('payments')
          .select('*')
          .eq('id', payInvoiceId)
          .maybeSingle();

        if (dbError) throw dbError;
        if (!data) {
          throw new Error('Tautan pembayaran tidak ditemukan atau sudah kedaluwarsa.');
        }

        setPayment(data);
      } catch (err) {
        console.error('Fetch payment link details error:', err);
        setError(err.message || 'Gagal memuat detail pembayaran.');
      } finally {
        setLoading(false);
      }
    };

    if (payInvoiceId) {
      fetchPayment();
    }
  }, [payInvoiceId]);

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 animate-pulse text-zinc-500">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-zinc-800 rounded" />
            <div className="h-3.5 w-48 bg-zinc-800 rounded" />
          </div>
          <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2.5">
            <div className="h-3 w-16 bg-zinc-800 rounded" />
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="h-px bg-zinc-850 my-1" />
            <div className="flex justify-between items-center">
              <div className="h-5 w-16 bg-zinc-800 rounded" />
              <div className="h-5 w-20 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="h-[280px] bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto py-16 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 text-xl font-bold mx-auto mb-4">
            ✕
          </div>
          <h3 className="text-base font-bold text-zinc-100 mb-2">Gagal Memproses</h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg transition-colors text-xs shadow-sm max-w-[200px] mx-auto block"
          >
            Segarkan Halaman
          </button>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  const isPaid = payment.status === 'paid' || payment.status === 'success';

  const serviceMock = {
    name: payment.description || 'Pembayaran Kustom',
    price: payment.amount,
  };

  const customerMock = {
    name: payment.customer_name || 'Customer',
    email: payment.customer_email || 'customer@bayar.dev',
    phone: payment.customer_phone || '',
  };

  return (
    <div className="w-full">
      {isPaid ? (
        <SuccessPage
          paymentData={payment}
          customer={customerMock}
          service={serviceMock}
        />
      ) : (
        <PaymentStep
          service={serviceMock}
          customer={customerMock}
          onSuccess={(updatedPayment) => {
            setPayment(updatedPayment);
          }}
          onBack={null} // Hide back button for direct pay
          initialPaymentData={payment}
        />
      )}
    </div>
  );
}
