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
    const body = await req.json();

    // Bayar.gg webhook payload typically includes:
    // invoice_id, status, amount, payment_method
    const invoiceId = body.invoice_id ?? body.invoiceId;
    const status = body.status;

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: "Missing invoice_id in webhook payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!status) {
      return new Response(
        JSON.stringify({ error: "Missing status in webhook payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Normalise the status string to lowercase
    const normalisedStatus = String(status).toLowerCase();

    // Update the payment record matching the invoice_id
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .update({
        status: normalisedStatus,
        payment_method: body.payment_method ?? body.paymentMethod ?? undefined,
        webhook_data: body, // store the entire raw webhook payload
      })
      .eq("invoice_id", invoiceId)
      .select()
      .single();

    if (dbError) {
      console.error("Database update error:", dbError);

      // If no matching row was found, return 404
      if (dbError.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "Payment not found for the given invoice_id" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      throw dbError;
    }

    console.log(
      `Webhook processed: invoice=${invoiceId}, status=${normalisedStatus}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: payment.id,
          invoice_id: payment.invoice_id,
          status: payment.status,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
