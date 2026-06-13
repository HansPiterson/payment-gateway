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

    // Call both endpoints in parallel: account status (for exact stats) and list payments (for chart and tables)
    const [statusResponse, listResponse] = await Promise.all([
      fetch("https://www.bayar.gg/api/get-account-status.php", {
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

    if (!statusResponse.ok || !listResponse.ok) {
      console.error(
        "Bayar.gg API error: status =",
        statusResponse.status,
        "list =",
        listResponse.status
      );
      return new Response(
        JSON.stringify({
          error: "Failed to fetch data from Bayar.gg APIs",
          statusError: statusResponse.statusText,
          listError: listResponse.statusText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const statusData = await statusResponse.json();
    const listData = await listResponse.json();

    const statsFromApi = statusData?.data?.statistics || {};
    const rawPayments = Array.isArray(listData.data) ? listData.data : [];

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

    // EXACT lifetime metrics from status api
    const exactTotalRevenue = Number(statsFromApi.total_revenue ?? 0);
    const exactPaidPayments = Number(statsFromApi.paid_payments ?? 0);
    const exactExpiredPayments = Number(statsFromApi.expired_payments ?? 0);

    // Default target for revenue
    const revenueTarget = 10000000; // 10 Million IDR target
    const targetProgress = exactTotalRevenue >= revenueTarget ? 100 : Number(((exactTotalRevenue / revenueTarget) * 100).toFixed(1));

    // Stats Cards Formatted using EXACT account statistics
    const stats = {
      totalSales: {
        value: exactPaidPayments.toLocaleString("id-ID"),
        growth: salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
        isPositive: salesGrowth >= 0,
        lastMonth: lastMonthSales.toLocaleString("id-ID"),
      },
      newCustomers: {
        value: uniqueCustomers.size.toLocaleString("id-ID"), // Estimated from list
        growth: customersGrowth >= 0 ? `+${customersGrowth}%` : `${customersGrowth}%`,
        isPositive: customersGrowth >= 0,
        lastMonth: lastMonthCustomers.size.toLocaleString("id-ID"),
      },
      returnProducts: {
        value: exactExpiredPayments.toLocaleString("id-ID"),
        growth: "0%",
        isPositive: false,
        lastMonth: "0",
      },
      totalRevenue: {
        value: exactTotalRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
        lastMonth: lastMonthRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
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
