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

    // Call Bayar.gg List Payments API (Fetch latest 100 payments)
    const bayarResponse = await fetch(
      "https://www.bayar.gg/api/list-payments.php?limit=100",
      {
        method: "GET",
        headers: {
          "X-API-Key": bayarApiKey,
        },
      },
    );

    if (!bayarResponse.ok) {
      const errorText = await bayarResponse.text();
      console.error("Bayar.gg list-payments error:", bayarResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch payments from Bayar.gg",
          details: errorText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resData = await bayarResponse.json();
    const rawPayments = Array.isArray(resData.data) ? resData.data : [];

    // Helper variables for processing
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

    let totalRevenue = 0;
    let totalSales = 0;
    const uniqueCustomers = new Set<string>();
    let returnProducts = 0; // failed, cancelled, expired

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

    // Process payments
    rawPayments.forEach((p: any) => {
      const amount = Number(p.amount || 0);
      const status = String(p.status || "pending").toLowerCase();
      const customerEmail = p.customer_email || p.customer_name || "unknown";
      
      // We parse date, usually in format YYYY-MM-DD HH:mm:ss or ISO
      const dateStr = p.created_at || p.paid_at || "";
      if (!dateStr) return;
      
      const pDate = new Date(dateStr.replace(" ", "T")); // handle YYYY-MM-DD HH:mm:ss to ISO
      if (isNaN(pDate.getTime())) return;

      const pYear = pDate.getFullYear();
      const pMonth = pDate.getMonth();
      const pMonthPrefix = `${pYear}-${String(pMonth + 1).padStart(2, '0')}`;

      // Stats counts
      if (status === "paid") {
        totalRevenue += amount;
        totalSales += 1;
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
      } else if (status === "cancelled" || status === "expired") {
        returnProducts += 1;
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
          revenue: item.value >= 1000 ? `$${(item.value / 1000).toFixed(1)}k` : `$${item.value}`
        };
      });

    // Formatting recent orders (latest 10 payments)
    const recentOrders = rawPayments.slice(0, 10).map((p: any) => {
      // Map status
      const rawStatus = String(p.status || "pending").toLowerCase();
      let displayStatus = "Pending";
      if (rawStatus === "paid") displayStatus = "Delivered";
      else if (rawStatus === "cancelled" || rawStatus === "expired") displayStatus = "Cancelled";

      // Date format (Jun 10, 2026)
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

    // Default target for revenue
    const revenueTarget = 10000000; // 10 Million IDR target
    const targetProgress = totalRevenue >= revenueTarget ? 100 : Number(((totalRevenue / revenueTarget) * 100).toFixed(1));

    // Stats Cards Formatted
    const stats = {
      totalSales: {
        value: totalSales.toLocaleString("id-ID"),
        growth: salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
        isPositive: salesGrowth >= 0,
        lastMonth: lastMonthSales.toLocaleString("id-ID"),
      },
      newCustomers: {
        value: uniqueCustomers.size.toLocaleString("id-ID"),
        growth: customersGrowth >= 0 ? `+${customersGrowth}%` : `${customersGrowth}%`,
        isPositive: customersGrowth >= 0,
        lastMonth: lastMonthCustomers.size.toLocaleString("id-ID"),
      },
      returnProducts: {
        value: returnProducts.toLocaleString("id-ID"),
        growth: "-0%", // Static/not critical
        isPositive: false,
        lastMonth: "0",
      },
      totalRevenue: {
        value: totalRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
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
            salesCount: totalSales,
            salesGrowth: salesGrowth >= 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
            revenue: totalRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
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
