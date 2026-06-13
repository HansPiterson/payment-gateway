import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const { amount } = await req.json();
    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Jumlah penarikan harus berupa angka positif" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Fetch current wallet
    const { data: wallet, error: walletError } = await supabase
      .from("merchant_wallet")
      .select("id, balance")
      .maybeSingle();

    if (walletError || !wallet) {
      console.error("Wallet query error:", walletError);
      return new Response(
        JSON.stringify({ error: "Wallet tidak ditemukan di database" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const currentBalance = Number(wallet.balance);

    if (currentBalance < withdrawAmount) {
      return new Response(
        JSON.stringify({ error: `Saldo tidak mencukupi. Saldo saat ini: Rp ${currentBalance.toLocaleString("id-ID")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const newBalance = currentBalance - withdrawAmount;

    // Deduct from wallet
    const { error: updateError } = await supabase
      .from("merchant_wallet")
      .update({
        balance: newBalance,
        updated_at: new Date(),
      })
      .eq("id", wallet.id);

    if (updateError) {
      console.error("Wallet update error:", updateError);
      throw new Error("Gagal memotong saldo wallet");
    }

    // Record payout in withdrawals table
    const { error: recordError } = await supabase
      .from("withdrawals")
      .insert({
        amount: withdrawAmount,
        status: "completed",
      });

    if (recordError) {
      console.error("Withdrawal record error:", recordError);
      // We don't rollback since wallet is already updated, but we log the issue
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          withdrawn_amount: withdrawAmount,
          new_balance: newBalance,
          message: `Penarikan saldo sebesar Rp ${withdrawAmount.toLocaleString("id-ID")} berhasil dilakukan.`,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    console.error("Withdrawal error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
