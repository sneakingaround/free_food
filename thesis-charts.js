/* global Chart */
window.ThesisCharts = (function () {
  "use strict";

  const cache = new Map();

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

  function fyLabel(yearStr) {
    const y = parseInt(String(yearStr).replace(/\D/g, ""), 10);
    if (!Number.isFinite(y)) return yearStr;
    const short = String(y).slice(-2);
    return `FY${short}`;
  }

  function mergeAnnualEps(thesis, market) {
    const byYear = new Map();
    (market?.earningsAnnual || []).forEach((r) => {
      byYear.set(String(r.year), { eps: r.eps, estimate: false });
    });
    const revYears = thesis.revenueYears || [];
    const rev = thesis.revenue || [];
    revYears.forEach((fy, i) => {
      const y = String(fy).replace(/^FY/i, "");
      if (!byYear.has(y) && rev[i] != null) byYear.set(y, { eps: null, estimate: false });
    });
    (thesis.epsYears || []).forEach((label, i) => {
      const y = String(label).replace(/E$/i, "");
      if (thesis.eps[i] != null) byYear.set(y, { eps: thesis.eps[i], estimate: /E/i.test(label) });
    });
    const years = [...byYear.keys()].sort((a, b) => Number(a) - Number(b));
    const slice = years.length > 10 ? years.slice(-10) : years;
    return {
      labels: slice.map(fyLabel),
      values: slice.map((y) => byYear.get(y)?.eps),
      estimates: slice.map((y) => !!byYear.get(y)?.estimate),
    };
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

  /** Dual-axis: left = monthly price, right = quarterly + annual EPS trend */
  function renderPriceEarningsCompare(market, c, makeChart) {
    const bars = market?.bars10y || [];
    if (!bars.length) return false;

    const tickLabels = monthTickLabels(bars);
    const xMax = bars.length - 1;

    const pricePts = bars.map((b, x) => ({ x, y: b.c }));

    const quarterly = (market.earningsQuarterly || [])
      .filter((e) => e.eps != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    const epsQuarterPts = quarterly.map((e) => ({
      x: nearestBarIndex(bars, e.date),
      y: e.eps,
      date: e.date,
    }));

    const annual = (market.earningsAnnual || []).slice().sort((a, b) => Number(a.year) - Number(b.year));
    const epsAnnualPts = annual
      .map((a) => {
        const idx = lastMonthIndexForYear(bars, Number(a.year));
        if (idx < 0) return null;
        return { x: idx, y: a.eps, year: a.year };
      })
      .filter(Boolean);

    const datasets = [
      {
        type: "line",
        label: "Share price",
        data: pricePts,
        yAxisID: "yPrice",
        borderColor: c.info,
        backgroundColor: "rgba(110,168,254,0.1)",
        fill: true,
        tension: 0.12,
        pointRadius: 0,
        borderWidth: 2,
        order: 2,
      },
    ];

    if (epsQuarterPts.length >= 2) {
      datasets.push({
        type: "line",
        label: "EPS (quarterly reported)",
        data: epsQuarterPts,
        yAxisID: "yEps",
        borderColor: c.success,
        backgroundColor: "rgba(61,214,140,0.08)",
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: c.success,
        tension: 0.15,
        spanGaps: true,
        order: 1,
      });
    }

    if (epsAnnualPts.length >= 2) {
      datasets.push({
        type: "line",
        label: "EPS (annual)",
        data: epsAnnualPts,
        yAxisID: "yEps",
        borderColor: c.warning,
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointStyle: "rectRot",
        tension: 0.1,
        spanGaps: true,
        order: 0,
      });
    }

    if (datasets.length < 2) return false;

    makeChart(
      "chart-compare",
      {
        data: { datasets },
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
                  if (ctx.dataset.yAxisID === "yEps") {
                    const tag = raw?.date || (raw?.year ? `FY${String(raw.year).slice(-2)}` : "");
                    return `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}${tag ? ` · ${tag}` : ""}`;
                  }
                  return `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`;
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
              grid: { color: "rgba(42,49,66,0.6)" },
            },
            yPrice: {
              type: "linear",
              position: "left",
              title: {
                display: true,
                text: "Price ($)",
                color: c.info,
                font: { size: 11, weight: "600" },
              },
              ticks: {
                color: c.info,
                callback: (v) => `$${v}`,
              },
              grid: { color: "rgba(42,49,66,0.85)" },
            },
            yEps: {
              type: "linear",
              position: "right",
              title: {
                display: true,
                text: "EPS ($)",
                color: c.success,
                font: { size: 11, weight: "600" },
              },
              ticks: {
                color: c.success,
                callback: (v) => `$${v}`,
              },
              grid: { drawOnChartArea: false },
            },
          },
        },
      },
      { xxl: true }
    );
    return true;
  }

  function renderQuarterlyEps(market, c, makeChart) {
    const q = (market.earningsQuarterly || []).filter((e) => e.eps != null);
    if (q.length < 2) return false;

    const labels = q.map((e) => {
      const d = new Date(e.date);
      return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(-2)}`;
    });

    makeChart(
      "chart-eps-quarterly",
      {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "EPS estimate ($)",
              data: q.map((e) => e.estimate),
              backgroundColor: "rgba(139,149,168,0.35)",
              borderRadius: 4,
            },
            {
              label: "EPS reported ($)",
              data: q.map((e) => e.eps),
              backgroundColor: c.success,
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins: { legend: { display: true } },
          scales: {
            x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 9 } } },
          },
        },
      },
      { lg: true }
    );
    return true;
  }

  function renderAnnualEps(thesis, market, c, makeChart) {
    const series = mergeAnnualEps(thesis, market);
    if (!series.labels.length) return false;

    const colors = series.values.map((v, i) => {
      if (v == null) return "rgba(139,149,168,0.25)";
      return series.estimates[i] ? "rgba(251,191,36,0.85)" : c.success;
    });

    makeChart(
      "chart-eps-annual",
      {
        type: "bar",
        data: {
          labels: series.labels,
          datasets: [
            {
              label: "Diluted EPS ($)",
              data: series.values,
              backgroundColor: colors,
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(ctx) {
                  const est = series.estimates[ctx.dataIndex];
                  const v = ctx.parsed.y;
                  if (v == null) return "n/a";
                  return `${est ? "Estimate" : "Reported"}: $${v.toFixed(2)}`;
                },
              },
            },
          },
        },
      },
      { lg: true }
    );
    return true;
  }

  async function mount(id, thesis, view, helpers) {
    const { chartColors, makeChart } = helpers;
    const c = chartColors();
    let market = null;
    try {
      market = await loadMarket(id);
    } catch {
      market = null;
    }

    if (view === "thesis") {
      if (market) renderPriceEarningsCompare(market, c, makeChart);
      renderAnnualEps(thesis, market, c, makeChart);
      if (market) renderQuarterlyEps(market, c, makeChart);
    }
    return market;
  }

  return { loadMarket, mount, mergeAnnualEps };
})();
