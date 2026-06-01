/* global Chart */
window.ThesisCharts = (function () {
  "use strict";

  const cache = new Map();

  /** Godel EM metric keys (not per-share). */
  const METRICS = {
    sales: { id: "sales", label: "Sales", axis: "$B revenue", thesisKey: "revenue" },
    netincome: { id: "netincome", label: "Net Income", axis: "$B net income", thesisKey: "netIncome" },
    ebitda: { id: "ebitda", label: "EBITDA", axis: "$B EBITDA", thesisKey: "ebitda" },
  };

  const GODEL = {
    actual: "#3dd68c",
    actualFill: "rgba(61,214,140,0.15)",
    estimate: "rgba(232,236,244,0.9)",
    estimateFill: "rgba(232,236,244,0.08)",
    price: "#6ea8fe",
    priceFill: "rgba(110,168,254,0.1)",
  };

  async function loadMarket(id) {
    if (cache.has(id)) return cache.get(id);
    const url = new URL(`market/${id}.json`, document.baseURI);
    const p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`market/${id}.json HTTP ${r.status}`);
      return r.json();
    });
    cache.set(id, p);
    return p;
  }

  function fyYear(fy) {
    return parseInt(String(fy).replace(/^FY/i, ""), 10);
  }

  /** 10y annual series from thesis (Godel FA / revenue table). */
  function annualFromThesis(thesis, metricId) {
    const years = thesis.revenueYears || [];
    const pts = [];
    years.forEach((fy, i) => {
      const year = fyYear(fy);
      let val = null;
      if (metricId === "sales") val = thesis.revenue?.[i];
      else if (metricId === "netincome" && thesis.revenue?.[i] != null && thesis.netMargin?.[i] != null) {
        val = (thesis.revenue[i] * thesis.netMargin[i]) / 100;
      }
      if (val != null) pts.push({ year, valueB: Math.round(val * 1000) / 1000, estimate: false });
    });
    return pts;
  }

  function annualFromMarket(market, metricId) {
    return (market?.fundamentalsAnnual || [])
      .map((r) => {
        const v = r[metricId];
        if (v == null) return null;
        return { year: Number(r.year), valueB: v, estimate: false };
      })
      .filter(Boolean)
      .sort((a, b) => a.year - b.year);
  }

  function mergeAnnual(thesis, market, metricId) {
    const map = new Map();
    annualFromThesis(thesis, metricId).forEach((p) => map.set(p.year, p));
    annualFromMarket(market, metricId).forEach((p) => map.set(p.year, p));
    return [...map.values()].sort((a, b) => a.year - b.year);
  }

  function quarterlyFromMarket(market, metricId) {
    return (market?.fundamentalsQuarterly || [])
      .map((r) => {
        const v = r[metricId];
        if (v == null) return null;
        return { date: r.date, valueB: v };
      })
      .filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function monthTickLabels(bars) {
    const out = [];
    let lastYear = "";
    bars.forEach((b) => {
      const y = String(new Date(b.t * 1000).getFullYear());
      out.push(y !== lastYear ? y : "");
      lastYear = y;
    });
    return out;
  }

  function nearestBarIndex(bars, isoDate) {
    const target = new Date(isoDate).getTime() / 1000;
    let best = 0;
    let bestDiff = Infinity;
    bars.forEach((b, i) => {
      const d = Math.abs(b.t - target);
      if (d < bestDiff) {
        bestDiff = d;
        best = i;
      }
    });
    return best;
  }

  function lastMonthIndexForYear(bars, year) {
    let idx = -1;
    bars.forEach((b, i) => {
      if (new Date(b.t * 1000).getFullYear() === year) idx = i;
    });
    return idx;
  }

  /** Dual-axis: price ($) left · fundamental ($B) right */
  function renderDualCompare(bars, annualPts, meta, c, makeChart) {
    if (!bars.length || annualPts.length < 2) return false;

    const tickLabels = monthTickLabels(bars);
    const xMax = bars.length - 1;
    const pricePts = bars.map((b, x) => ({ x, y: b.c }));

    const fundPts = annualPts
      .map((p) => {
        const idx = lastMonthIndexForYear(bars, p.year);
        if (idx < 0) return null;
        return { x: idx, y: p.valueB, year: p.year, estimate: p.estimate };
      })
      .filter(Boolean);

    if (fundPts.length < 2) return false;

    makeChart(
      "chart-compare",
      {
        data: {
          datasets: [
            {
              type: "line",
              label: "Share price ($)",
              data: pricePts,
              yAxisID: "yPrice",
              borderColor: GODEL.price,
              backgroundColor: GODEL.priceFill,
              fill: true,
              tension: 0.12,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              type: "line",
              label: `${meta.label} ($B)`,
              data: fundPts,
              yAxisID: "yFund",
              borderColor: GODEL.actual,
              backgroundColor: GODEL.actualFill,
              borderWidth: 2.5,
              pointRadius: 5,
              pointBackgroundColor: GODEL.actual,
              tension: 0.1,
              spanGaps: true,
            },
          ],
        },
        options: {
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: true, position: "top" },
            tooltip: {
              callbacks: {
                title(items) {
                  const i = items[0]?.parsed?.x;
                  if (i == null) return "";
                  const d = new Date(bars[Math.round(i)]?.t * 1000);
                  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
                },
                label(ctx) {
                  const raw = ctx.raw;
                  if (ctx.dataset.yAxisID === "yFund") {
                    return `${meta.label}: $${ctx.parsed.y.toFixed(2)}B${raw?.year ? ` · FY${String(raw.year).slice(-2)}` : ""}`;
                  }
                  return `Price: $${ctx.parsed.y.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: "linear",
              min: 0,
              max: Math.max(xMax, 1),
              ticks: {
                maxTicksLimit: 11,
                font: { size: 9 },
                callback: (v) => tickLabels[Math.round(v)] || "",
              },
            },
            yPrice: {
              position: "left",
              title: { display: true, text: "Price ($)", color: GODEL.price, font: { size: 11, weight: "600" } },
              ticks: { color: GODEL.price, callback: (v) => `$${v}` },
              grid: { color: "rgba(42,49,66,0.85)" },
            },
            yFund: {
              position: "right",
              title: { display: true, text: meta.axis, color: GODEL.actual, font: { size: 11, weight: "600" } },
              ticks: { color: GODEL.actual, callback: (v) => `$${v}B` },
              grid: { drawOnChartArea: false },
            },
          },
        },
      },
      { xxl: true }
    );
    return true;
  }

  /** Godel EM: annual line (green actual, hollow/white forward if we tag estimates later) */
  function renderEmAnnual(annualPts, meta, makeChart) {
    if (annualPts.length < 2) return false;
    const labels = annualPts.map((p) => `FY${String(p.year).slice(-2)}`);
    const values = annualPts.map((p) => p.valueB);

    makeChart(
      "chart-em-annual",
      {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: `${meta.label} ($B) · yearly`,
              data: values,
              borderColor: GODEL.actual,
              backgroundColor: GODEL.actualFill,
              pointBackgroundColor: GODEL.actual,
              pointBorderColor: "#0a0b0f",
              pointRadius: 4,
              borderWidth: 2,
              fill: false,
              tension: 0.05,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { callback: (v) => `$${v}B` } },
          },
        },
      },
      { lg: true }
    );
    return true;
  }

  /** Godel EM: quarterly bars */
  function renderEmQuarterly(quarterPts, meta, makeChart) {
    if (quarterPts.length < 2) return false;
    const labels = quarterPts.map((r) => {
      const d = new Date(r.date);
      return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(-2)}`;
    });

    makeChart(
      "chart-em-quarter",
      {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: `${meta.label} ($B) · quarterly`,
              data: quarterPts.map((r) => r.valueB),
              backgroundColor: GODEL.actual,
              borderRadius: 3,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 9 } } },
            y: { ticks: { callback: (v) => `$${v}B` } },
          },
        },
      },
      { lg: true }
    );
    return true;
  }

  function renderRevMargin(thesis, c, makeChart) {
    makeChart(
      "chart-rev",
      {
        type: "line",
        data: {
          labels: thesis.revenueYears,
          datasets: [{
            label: "Revenue ($B)",
            data: thesis.revenue,
            borderColor: c.info,
            backgroundColor: "rgba(110,168,254,0.15)",
            fill: true,
            tension: 0.3,
          }],
        },
      },
      { lg: true }
    );
    makeChart(
      "chart-margin",
      {
        type: "line",
        data: {
          labels: thesis.revenueYears,
          datasets: [
            { label: "Operating %", data: thesis.opMargin, borderColor: c.success, tension: 0.3 },
            { label: "Net %", data: thesis.netMargin, borderColor: c.info, tension: 0.3 },
          ],
        },
      },
      { lg: true }
    );
  }

  async function mount(id, thesis, view, helpers) {
    const { chartColors, makeChart, getMetric } = helpers;
    const metricId = getMetric?.() || "sales";
    const meta = METRICS[metricId] || METRICS.sales;
    const c = chartColors();

    let market = null;
    try {
      market = await loadMarket(id);
    } catch {
      market = null;
    }

    if (view !== "thesis") return market;

    const annualPts = mergeAnnual(thesis, market, metricId);
    const quarterPts = quarterlyFromMarket(market, metricId);
    const bars = market?.bars10y || [];

    if (bars.length) renderDualCompare(bars, annualPts, meta, c, makeChart);
    renderEmAnnual(annualPts, meta, makeChart);
    renderEmQuarterly(quarterPts, meta, makeChart);
    renderRevMargin(thesis, c, makeChart);

    return market;
  }

  return { loadMarket, mount, METRICS };
})();
