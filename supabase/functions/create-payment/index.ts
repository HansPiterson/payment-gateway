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
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const { amount, description, customer_name, customer_email, customer_phone } = body;

    const errors: string[] = [];
    if (!amount || typeof amount !== "number" || amount <= 0) {
      errors.push("amount is required and must be a positive number");
    }
    if (!description || typeof description !== "string") {
      errors.push("description is required");
    }
    if (!customer_name || typeof customer_name !== "string") {
      errors.push("customer_name is required");
    }
    if (!customer_email || typeof customer_email !== "string") {
      errors.push("customer_email is required");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Retrieve secrets and env vars
    const bayarApiKey = Deno.env.get("BAYAR_GG_API_KEY");
    if (!bayarApiKey) {
      throw new Error("BAYAR_GG_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Build the callback URL pointing to our webhook edge function
    const callbackUrl = `${supabaseUrl}/functions/v1/webhook-callback`;

    // Call Bayar.gg Create Payment API
    const bayarResponse = await fetch(
      "https://www.bayar.gg/api/create-payment.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": bayarApiKey,
        },
        body: JSON.stringify({
          amount,
          description,
          customer_name,
          customer_email,
          customer_phone: customer_phone || "",
          payment_method: "qris",
          callback_url: callbackUrl,
          payment_url: "https://www.bayar.gg/pay",
        }),
      },
    );

    if (!bayarResponse.ok) {
      const errorText = await bayarResponse.text();
      console.error("Bayar.gg API error:", bayarResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to create payment with Bayar.gg",
          details: errorText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bayarData = await bayarResponse.json();

    // Initialise Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Insert payment record
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .insert({
        invoice_id: bayarData.invoice_id ?? bayarData.invoiceId ?? null,
        amount,
        description,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        status: "pending",
        payment_method: "qris",
        payment_url: bayarData.payment_url ?? bayarData.paymentUrl ?? null,
        qris_url: bayarData.qris_url ?? bayarData.qrisUrl ?? null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: payment.id,
          invoice_id: payment.invoice_id,
          amount: payment.amount,
          status: payment.status,
          payment_url: payment.payment_url,
          qris_url: payment.qris_url,
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
