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

  function monthLabels(bars) {
    const out = [];
    let lastYear = "";
    bars.forEach((b) => {
      const d = new Date(b.t * 1000);
      const y = String(d.getFullYear());
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

  function renderPriceEarnings(id, thesis, market, c, makeChart) {
    const bars = market?.bars10y || [];
    if (!bars.length) return false;

    const labels = monthLabels(bars);
    const prices = bars.map((b) => b.c);
    const pricePts = prices.map((y, x) => ({ x, y }));
    const q = (market.earningsQuarterly || []).filter((e) => e.eps != null);

    const earnPoints = q.map((e) => {
      const idx = nearestBarIndex(bars, e.date);
      return { x: idx, y: prices[idx], eps: e.eps, date: e.date };
    });

    makeChart(
      "chart-price-10y",
      {
        data: {
          datasets: [
            {
              type: "line",
              label: "Monthly close ($)",
              data: pricePts,
              borderColor: c.info,
              backgroundColor: "rgba(110,168,254,0.08)",
              fill: true,
              tension: 0.15,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              type: "scatter",
              label: "Earnings report",
              data: earnPoints,
              pointRadius: earnPoints.length ? 5 : 0,
              pointHoverRadius: 7,
              backgroundColor: c.success,
              borderColor: "#0a0b0f",
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label(ctx) {
                  if (ctx.raw?.eps != null) {
                    return `${ctx.raw.date}: EPS $${ctx.raw.eps} · price $${ctx.raw.y?.toFixed(2)}`;
                  }
                  return `$${ctx.parsed.y?.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: "linear",
              min: 0,
              max: Math.max(bars.length - 1, 1),
              ticks: {
                maxTicksLimit: 12,
                font: { size: 9 },
                callback: (v) => labels[Math.round(v)] || "",
              },
            },
            y: { ticks: { callback: (v) => `$${v}` } },
          },
        },
      },
      { xl: true }
    );
    return true;
  }

  function renderQuarterlyEps(market, c, makeChart) {
    const q = (market?.earningsQuarterly || []).filter((e) => e.eps != null);
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
      { xl: true }
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
      renderAnnualEps(thesis, market, c, makeChart);
      if (market) {
        renderPriceEarnings(id, thesis, market, c, makeChart);
        renderQuarterlyEps(market, c, makeChart);
      }
    }
    return market;
  }

  return { loadMarket, mount, mergeAnnualEps };
})();
