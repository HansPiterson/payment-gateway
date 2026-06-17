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
    const body = await req.json();
    const { amount, description, customer_name, customer_email, customer_phone, campaign_id, is_anonymous, message, origin: bodyOrigin, telegram_user_id, credits, metadata: bodyMetadata } = body;

    // Optional API Secret Key Authentication (for external services like Telegram bots)
    const customSecret = Deno.env.get("API_SECRET_KEY");
    if (customSecret) {
      const clientSecret = req.headers.get("x-api-key") || body.api_key;
      if (clientSecret !== customSecret) {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: "Unauthorized: Invalid or missing API key" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
    }

    const errors: string[] = [];
    if (!amount || typeof amount !== "number" || amount <= 0) {
      errors.push("amount is required and must be a positive number");
    }
    if (!description || typeof description !== "string") {
      errors.push("description is required");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Set defaults for customer fields if not supplied by the bot
    const finalCustomerName = customer_name || "Telegram Customer";
    const finalCustomerEmail = customer_email || "customer@bayar.dev";

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
          customer_name: finalCustomerName,
          customer_email: finalCustomerEmail,
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
    const resData = bayarData.data || bayarData;

    // Initialise Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Compile metadata for bot/custom tracking
    const finalMetadata = {
      ...(bodyMetadata || {}),
      telegram_user_id: telegram_user_id || undefined,
      credits: credits || undefined,
    };

    // Insert payment record
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .insert({
        invoice_id: resData.invoice_id ?? resData.invoiceId ?? null,
        amount,
        description,
        customer_name: finalCustomerName,
        customer_email: finalCustomerEmail,
        customer_phone: customer_phone || null,
        status: "pending",
        payment_method: "qris",
        payment_url: resData.payment_url ?? resData.paymentUrl ?? null,
        qris_url: resData.qris_url ?? resData.qrisUrl ?? null,
        qris_content: resData.qris_content ?? resData.qrisContent ?? resData.qris_string ?? resData.qrisString ?? null,
        campaign_id: campaign_id || null,
        is_anonymous: is_anonymous || false,
        message: message || null,
        metadata: finalMetadata,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw dbError;
    }

    // Resolve the web application checkout URL
    let appOrigin = bodyOrigin || Deno.env.get("APP_URL");
    if (!appOrigin) {
      const referer = req.headers.get("referer");
      if (referer) {
        try {
          appOrigin = new URL(referer).origin;
        } catch (_) {
          // ignore parsing errors
        }
      }
    }
    if (!appOrigin) {
      appOrigin = "https://bayar-gateway.vercel.app"; // default fallback
    }

    const checkoutUrl = `${appOrigin}/pay/${payment.id}`;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: payment.id,
          invoice_id: payment.invoice_id,
          amount: payment.amount,
          status: payment.status,
          checkout_url: checkoutUrl,
          payment_url: payment.payment_url,
          qris_url: payment.qris_url,
          qris_content: payment.qris_content,
          created_at: payment.created_at,
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
