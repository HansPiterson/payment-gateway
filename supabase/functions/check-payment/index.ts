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
    // Extract invoice_id from query params
    const url = new URL(req.url);
    const invoiceId = url.searchParams.get("invoice_id");

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: "invoice_id query parameter is required" }),
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
    const normalisedStatus = String(bayarData.status ?? "unknown").toLowerCase();

    // Fetch existing payment status to detect payment state changes
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("status, amount")
      .eq("invoice_id", invoiceId)
      .maybeSingle();

    // Sync the status back to our database
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .update({
        status: normalisedStatus,
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
