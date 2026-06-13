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
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const bayarApiKey = Deno.env.get("BAYAR_GG_API_KEY");
    if (!bayarApiKey) {
      throw new Error("BAYAR_GG_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Call both endpoints: get-statistics.php (for period summary) and list-payments.php (for detail list)
    const [statsResponse, listResponse] = await Promise.all([
      fetch("https://www.bayar.gg/api/get-statistics.php?period=month", {
        method: "GET",
        headers: {
          "X-API-Key": bayarApiKey,
        },
      }),
      fetch("https://www.bayar.gg/api/list-payments.php?limit=100", {
        method: "GET",
        headers: {
          "X-API-Key": bayarApiKey,
        },
      }),
    ]);

    if (!statsResponse.ok || !listResponse.ok) {
      console.error(
        "Bayar.gg API error: stats =",
        statsResponse.status,
        "list =",
        listResponse.status
      );
      return new Response(
        JSON.stringify({
          error: "Failed to fetch data from Bayar.gg APIs",
          statsError: statsResponse.statusText,
          listError: listResponse.statusText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const statsData = await statsResponse.json();
    const listData = await listResponse.json();

    const periodSummary = statsData?.data?.summary || {};
    const rawPayments = Array.isArray(listData.data) ? listData.data : [];

    // --- DATABASE SYNC LOGIC ---
    // Save/Sync retrieved payments to local Supabase database
    if (rawPayments.length > 0) {
      const invoiceIds = rawPayments.map((p: any) => p.invoice_id ?? p.invoiceId).filter(Boolean);
      
      // Fetch existing payments first to preserve checkout URLs (payment_url and qris_url)
      const { data: existingPayments, error: selectError } = await supabase
        .from("payments")
        .select("invoice_id, payment_url, qris_url")
        .in("invoice_id", invoiceIds);

      if (selectError) {
        console.error("Error fetching existing payments for sync:", selectError);
      }

      const existingMap = new Map(existingPayments?.map(ep => [ep.invoice_id, ep]) || []);

      const paymentsToUpsert = rawPayments.map((p: any) => {
        const invId = p.invoice_id ?? p.invoiceId;
        const existing = existingMap.get(invId);
        return {
          invoice_id: invId,
          amount: Number(p.amount || 0),
          description: p.description || "Premium Plan",
          customer_name: p.customer_name || "Customer",
          customer_email: p.customer_email || "customer@bayar.dev",
          customer_phone: p.customer_phone || null,
          status: String(p.status || "pending").toLowerCase(),
          payment_method: p.payment_method || p.paid_via || "qris",
          payment_url: existing?.payment_url || null,
          qris_url: existing?.qris_url || null,
          created_at: p.created_at ? new Date(p.created_at.replace(" ", "T")) : new Date(),
          updated_at: new Date(),
        };
      });

      const { error: upsertError } = await supabase
        .from("payments")
        .upsert(paymentsToUpsert, { onConflict: "invoice_id" });

      if (upsertError) {
        console.error("Error syncing payments to Supabase DB:", upsertError);
      } else {
        console.log(`Successfully synced ${paymentsToUpsert.length} payments to Supabase DB`);
      }
    }

    // Helper variables for processing dates and chart
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth(); // 0-11
    
    // Monthly aggregation structure for chart (last 6 months)
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartDataMap: Record<string, { label: string; value: number; sales: number; monthIndex: number }> = {};
    
    // Initialize chartDataMap for last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = monthLabels[d.getMonth()];
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      chartDataMap[key] = {
        label: mLabel,
        value: 0,
        sales: 0,
        monthIndex: d.getMonth()
      };
    }

    const uniqueCustomers = new Set<string>();

    // MoM comparison stats
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    let thisMonthSales = 0;
    let lastMonthSales = 0;
    const thisMonthCustomers = new Set<string>();
    const lastMonthCustomers = new Set<string>();

    const thisMonthPrefix = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(currentYear, currentMonthNum - 1, 1);
    const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    // Process payments list to populate chart and MoM calculations
    rawPayments.forEach((p: any) => {
      const amount = Number(p.amount || 0);
      const status = String(p.status || "pending").toLowerCase();
      const customerEmail = p.customer_email || p.customer_name || "unknown";
      
      const dateStr = p.created_at || p.paid_at || "";
      if (!dateStr) return;
      
      const pDate = new Date(dateStr.replace(" ", "T")); // handle YYYY-MM-DD HH:mm:ss to ISO
      if (isNaN(pDate.getTime())) return;

      const pYear = pDate.getFullYear();
      const pMonth = pDate.getMonth();
      const pMonthPrefix = `${pYear}-${String(pMonth + 1).padStart(2, '0')}`;

      if (status === "paid") {
        uniqueCustomers.add(customerEmail);

        // Chart aggregation (last 6 months)
        if (chartDataMap[pMonthPrefix]) {
          chartDataMap[pMonthPrefix].value += amount;
          chartDataMap[pMonthPrefix].sales += 1;
        }

        // MoM Stats
        if (pMonthPrefix === thisMonthPrefix) {
          thisMonthRevenue += amount;
          thisMonthSales += 1;
          thisMonthCustomers.add(customerEmail);
        } else if (pMonthPrefix === lastMonthPrefix) {
          lastMonthRevenue += amount;
          lastMonthSales += 1;
          lastMonthCustomers.add(customerEmail);
        }
      }
    });

    // Formatting chart data to array sorted by date
    const chartData = Object.keys(chartDataMap)
      .sort()
      .map(key => {
        const item = chartDataMap[key];
        return {
          label: item.label,
          value: item.value,
          sales: item.sales,
          revenue: item.value >= 1000 ? `Rp ${(item.value / 1000).toLocaleString("id-ID")}k` : `Rp ${item.value.toLocaleString("id-ID")}`
        };
      });

    // Formatting recent orders (latest 10 payments)
    const recentOrders = rawPayments.slice(0, 10).map((p: any) => {
      const rawStatus = String(p.status || "pending").toLowerCase();
      let displayStatus = "Pending";
      if (rawStatus === "paid") displayStatus = "Delivered";
      else if (rawStatus === "cancelled" || rawStatus === "expired") displayStatus = "Cancelled";

      const dateStr = p.created_at || p.paid_at || "";
      let formattedDate = "Pending";
      if (dateStr) {
        const d = new Date(dateStr.replace(" ", "T"));
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        }
      }

      const amount = Number(p.amount || 0);

      return {
        id: `#ORD-${String(p.invoice_id || p.invoiceId || "").slice(-4).toUpperCase()}`,
        product: p.description || "Premium Plan",
        sku: `SKU-${String(p.invoice_id || "").slice(-6).toUpperCase()}`,
        image: null,
        date: formattedDate,
        customer: p.customer_name || p.customer_email || "Customer",
        category: "Subscription",
        status: displayStatus,
        items: 1,
        total: amount.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
      };
    });

    // Calculate Growth/Percentages MoM
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const revenueGrowth = calculateGrowth(thisMonthRevenue, lastMonthRevenue);
    const salesGrowth = calculateGrowth(thisMonthSales, lastMonthSales);
    const customersGrowth = calculateGrowth(thisMonthCustomers.size, lastMonthCustomers.size);

    // EXACT period statistics from /api/get-statistics.php
    const exactTotalRevenue = Number(periodSummary.total_revenue ?? 0);
    const exactPaidPayments = Number(periodSummary.paid ?? 0);
    const exactExpiredPayments = Number(periodSummary.expired ?? 0);
    const exactCancelledPayments = Number(periodSummary.cancelled ?? 0);

    // Default target for revenue progress
    const revenueTarget = 10000000; // 10 Million IDR target
    const targetProgress = exactTotalRevenue >= revenueTarget ? 100 : Number(((exactTotalRevenue / revenueTarget) * 100).toFixed(1));

    // Fetch wallet balance from database
    const { data: walletData, error: walletQueryError } = await supabase
      .from("merchant_wallet")
      .select("balance")
      .maybeSingle();

    if (walletQueryError) {
      console.error("Error querying wallet balance:", walletQueryError);
    }
    const currentBalance = Number(walletData?.balance ?? 2000);

    // Fetch all-time total revenue from local database payments table
    const { data: allPaidPayments, error: paidPaymentsError } = await supabase
      .from("payments")
      .select("amount")
      .or("status.eq.paid,status.eq.success");

    if (paidPaymentsError) {
      console.error("Error querying all-time paid payments:", paidPaymentsError);
    }

    const allTimeRevenue = allPaidPayments 
      ? allPaidPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)
      : 0;

    // Stats Cards Formatted using database values for wallet and all-time revenue
    const stats = {
      balance: {
        value: currentBalance.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
        growth: "", // No growth metric needed for absolute balance
        isPositive: true,
        lastMonth: "Pencatatan Saldo",
      },
      newCustomers: {
        value: uniqueCustomers.size.toLocaleString("id-ID"), // Estimated from list
        growth: customersGrowth >= 0 ? `+${customersGrowth}%` : `${customersGrowth}%`,
        isPositive: customersGrowth >= 0,
        lastMonth: lastMonthCustomers.size.toLocaleString("id-ID"),
      },
      returnProducts: {
        value: (exactExpiredPayments + exactCancelledPayments).toLocaleString("id-ID"),
        growth: "0%",
        isPositive: false,
        lastMonth: "0",
      },
      totalRevenue: {
        value: allTimeRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
        lastMonth: "Pendapatan Keseluruhan",
      }
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          stats,
          chartData,
          salesOverview: {
            growth: targetProgress,
            salesCount: exactPaidPayments,
            salesGrowth: salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
            revenue: exactTotalRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
            revenueGrowth: revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`,
          },
          recentOrders,
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
