import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    // Extract id (UUID) from query params
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("id");

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: "id query parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bayarApiKey = Deno.env.get("BAYAR_GG_API_KEY");
    if (!bayarApiKey) {
      throw new Error("BAYAR_GG_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Fetch the invoice_id associated with this UUID
    const { data: existingPayment, error: fetchError } = await supabase
      .from("payments")
      .select("invoice_id, status, amount")
      .eq("id", paymentId)
      .maybeSingle();

    if (fetchError || !existingPayment) {
      return new Response(
        JSON.stringify({ error: "Payment not found in local database" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const invoiceId = existingPayment.invoice_id;

    // Call Bayar.gg Check Payment API
    const bayarResponse = await fetch(
      `https://www.bayar.gg/api/check-payment.php?invoice=${encodeURIComponent(invoiceId)}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": bayarApiKey,
        },
      },
    );

    if (!bayarResponse.ok) {
      const errorText = await bayarResponse.text();
      console.error("Bayar.gg check-payment error:", bayarResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to check payment status with Bayar.gg",
          details: errorText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bayarData = await bayarResponse.json();
    const resData = bayarData.data || bayarData;
    const normalisedStatus = String(resData.status ?? "unknown").toLowerCase();

    // Use the existingPayment we fetched earlier to detect payment state changes

    // Sync the status back to our database
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .update({
        status: normalisedStatus,
        payment_method: resData.iqris_payment_methodby || resData.payment_method || resData.paymentMethod || undefined,
      })
      .eq("invoice_id", invoiceId)
      .select()
      .single();

    if (dbError) {
      // If no matching row, we still return the upstream data but flag it
      if (dbError.code === "PGRST116") {
        return new Response(
          JSON.stringify({
            success: true,
            source: "bayar.gg",
            warning: "Payment not found in local database",
            data: {
              invoice_id: invoiceId,
              status: normalisedStatus,
              raw: bayarData,
            },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.error("Database update error:", dbError);
      throw dbError;
    }

    // IF payment just transitioned to paid, increment wallet balance
    const wasPaid = existingPayment?.status === "paid" || existingPayment?.status === "success";
    const isNowPaid = normalisedStatus === "paid" || normalisedStatus === "success";

    if (!wasPaid && isNowPaid) {
      const { data: wallet } = await supabase
        .from("merchant_wallet")
        .select("id, balance")
        .maybeSingle();

      if (wallet) {
        const paymentAmount = Number(payment.amount ?? 0);
        const { error: walletError } = await supabase
          .from("merchant_wallet")
          .update({
            balance: Number(wallet.balance) + paymentAmount,
            updated_at: new Date(),
          })
          .eq("id", wallet.id);

        if (walletError) {
          console.error("Failed to update wallet balance on check:", walletError);
        } else {
          console.log(`Wallet balance increased by Rp ${paymentAmount} via manual check`);
        }
      }

      // Send push notification via ntfy.sh (fallback if manual check detects it before webhook)
      const ntfyTopic = Deno.env.get("NTFY_TOPIC");
      if (ntfyTopic) {
        const amountForNtfy = Number(payment.amount ?? 0);
        const formattedAmount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amountForNtfy);

        const description = payment.description || "-";
        const paymentMethod = payment.payment_method || "QRIS";
        
        try {
          await fetch(`https://ntfy.sh/${ntfyTopic}`, {
            method: 'POST',
            body: `Deskripsi: ${description}\nMetode: ${paymentMethod}\nInvoice: ${payment.invoice_id}`,
            headers: {
              'Title': `Pembayaran QRIS diterima ${formattedAmount}`,
              'Tags': 'moneybag,white_check_mark',
              'Priority': 'high'
            }
          });
          console.log(`Push notification sent to ntfy topic: ${ntfyTopic} via check-payment`);
        } catch (ntfyError) {
          console.error("Failed to send ntfy notification:", ntfyError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        source: "bayar.gg",
        data: {
          id: payment.id,
          invoice_id: payment.invoice_id,
          amount: payment.amount,
          status: payment.status,
          payment_method: payment.payment_method,
          payment_url: payment.payment_url,
          qris_url: payment.qris_url,
          qris_content: payment.qris_content,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
          raw: bayarData,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
