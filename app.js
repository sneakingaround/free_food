(function () {
  const chartInstances = [];

  function destroyCharts() {
    while (chartInstances.length) chartInstances.pop()?.destroy();
  }

  function chartColors() {
    return {
      info: "#6ea8fe",
      success: "#3dd68c",
      warning: "#fbbf24",
      muted: "#8b95a8",
      grid: "#2a3142",
      text: "#e8ecf4",
    };
  }

  function makeChart(canvasId, config) {
    const el = document.getElementById(canvasId);
    if (!el) return;
    const c = chartColors();
    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: c.text, boxWidth: 12, font: { size: 11 } },
        },
      },
      scales: {
        x: {
          ticks: { color: c.muted, maxRotation: 45, font: { size: 10 } },
          grid: { color: c.grid },
        },
        y: {
          ticks: { color: c.muted, font: { size: 10 } },
          grid: { color: c.grid },
        },
      },
    };
    chartInstances.push(
      new Chart(el, {
        ...config,
        options: { ...base, ...(config.options || {}) },
      }),
    );
  }

  function renderPill(tag, tone) {
    return `<span class="pill-sm ${tone || "info"}">${tag}</span>`;
  }

  function renderCard(p) {
    return `<div class="card">
      <div class="card-head">${p.title}${renderPill(p.tag, p.tagTone)}</div>
      <div class="card-body">${p.body}</div>
    </div>`;
  }

  function renderStats(t, wpt, wup) {
    const stats = [...t.stats];
    const last = { v: fmtPct(wup), l: "Prob-weighted PT", tone: wup >= 0 ? "success" : "danger" };
    stats.push(last);
    return stats
      .map((s) => {
        const tone = s.tone ? ` ${s.tone}` : "";
        return `<div class="stat"><div class="val${tone}">${s.v}</div><div class="lbl">${s.l}</div></div>`;
      })
      .join("");
  }

  function renderTable(t, price) {
    const rows = t.scenarios
      .map((s) => {
        const target = pt(s);
        const up = upside(price, target);
        const money = t.id === "ibm" ? target.toFixed(0) : target.toFixed(2);
        return `<tr class="row-${s.tone}">
          <td>${s.name}</td>
          <td class="num">${(s.prob * 100).toFixed(0)}%</td>
          <td class="num">$${s.eps.toFixed(2)}</td>
          <td class="num">${s.exitPe}x</td>
          <td class="num">$${money}</td>
          <td class="num">${fmtPct(up)}</td>
          <td>${s.thesis}</td>
        </tr>`;
      })
      .join("");
    return `<div class="table-wrap"><table>
      <thead><tr>
        <th>Scenario</th><th>Prob.</th><th>FY27 EPS</th><th>Exit P/E</th><th>Target</th><th>Upside</th><th>Driver</th>
      </tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderScenarioStats(t) {
    const w = weightedPT(t);
    const items = t.scenarios.map((s) => {
      const target = pt(s);
      const money = t.id === "ibm" ? target.toFixed(0) : target.toFixed(2);
      return `<div class="stat"><div class="val ${s.tone}">$${money}</div><div class="lbl">${s.name} target</div></div>`;
    });
    items.push(
      `<div class="stat"><div class="val ${upside(t.price, w) >= 0 ? "success" : "danger"}">$${t.id === "ibm" ? w.toFixed(0) : w.toFixed(2)}</div><div class="lbl">Weighted PT</div></div>`,
    );
    return items.join("");
  }

  function renderCallout(title, items, tone) {
    return `<div class="callout ${tone}">
      <div class="callout-title">${title}</div>
      <ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>`;
  }

  function renderThesisFundamentals(t) {
    return `
        <h2>Why this works — four load-bearing pillars</h2>
        <div class="grid-2">${t.pillars.map(renderCard).join("")}</div>
        <div class="grid-2">
          <div>
            <h3>Revenue trajectory ($B)</h3>
            <div class="chart-box"><canvas id="chart-rev"></canvas></div>
            <p class="caption">Y: Revenue ($B). X: Fiscal year. Source: Godel FA.</p>
          </div>
          <div>
            <h3>Margin expansion</h3>
            <div class="chart-box"><canvas id="chart-margin"></canvas></div>
            <p class="caption">Y: Margin (%). X: Fiscal year. Source: Godel FA.</p>
          </div>
        </div>
        <h3>EPS path (GAAP)</h3>
        <div class="chart-box"><canvas id="chart-eps"></canvas></div>
        <p class="caption">Y: EPS ($). Estimates 2026+. Source: Godel EM.</p>`;
  }

  function renderValuation(t) {
    return `
        <h2>Scenario valuation</h2>
        <p class="lead" style="margin-top:0">${t.valNote}</p>
        ${renderTable(t, t.price)}
        <div class="stats" style="grid-template-columns:repeat(2,1fr)">${renderScenarioStats(t)}</div>
        <h3>Forward P/E</h3>
        <div class="chart-box"><canvas id="chart-pe"></canvas></div>
        <p class="caption">Y: P/E (x). Source: Godel EM.</p>
        <div class="grid-2">
          <div><h3>Catalysts (long)</h3>${renderCallout("What extends the re-rate", t.catalysts, "success")}</div>
          <div><h3>Risks (short)</h3>${renderCallout("What breaks the thesis", t.risks, "danger")}</div>
        </div>`;
  }

  function renderThesis(t, view) {
    const wpt = weightedPT(t);
    const wup = upside(t.price, wpt);
    const tabBody = view === "thesis" ? renderThesisFundamentals(t) : renderValuation(t);

    return `
      <span class="badge">${t.ticker}</span>
      <p class="meta">${t.meta}</p>
      <h1>${t.title}</h1>
      <p class="lead">${t.lead}</p>
      <div class="stats">${renderStats(t, wpt, wup)}</div>

      <section class="mini-plots-section" aria-label="Price and volume profile">
        <h2 class="mini-plots-heading">${TICKER_LABELS[t.id]} · Price · Volume · VPVR</h2>
        <div id="mini-plot-active" class="mini-plot-active"></div>
        <p class="caption">6mo daily: candles, session volume bars, visible-range VPVR (POC + value area). Source: Yahoo Finance OHLCV.</p>
      </section>

      <div class="tab-panel">${tabBody}</div>

      <div class="verdict">
        <div class="verdict-head">Position recommendation <span class="pill-sm info">Verdict</span></div>
        <p>${t.verdict} Weighted PT <strong>$${t.id === "ibm" ? wpt.toFixed(0) : wpt.toFixed(2)}</strong> (${fmtPct(wup)}).</p>
        <div class="verdict-zones">${t.zones.map((z) => `<span class="zone ${z.tone}">${z.text}</span>`).join("")}</div>
        <p class="footnote">${t.footnote}</p>
      </div>
      <p class="disclaimer">Illustrative model for discussion, not investment advice. Godel Terminal, 2026-06-01.</p>
    `;
  }

  function bindCharts(t, view) {
    destroyCharts();
    const c = chartColors();
    // Only bind charts for the active tab (hidden panels are not in DOM as canvases)
    if (view === "thesis") {
      makeChart("chart-rev", {
        type: "line",
        data: {
          labels: t.revenueYears,
          datasets: [
            {
              label: "Revenue ($B)",
              data: t.revenue,
              borderColor: c.info,
              backgroundColor: "rgba(110,168,254,0.15)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
      });
      makeChart("chart-margin", {
        type: "line",
        data: {
          labels: t.revenueYears,
          datasets: [
            { label: "Operating %", data: t.opMargin, borderColor: c.success, tension: 0.3 },
            { label: "Net %", data: t.netMargin, borderColor: c.info, tension: 0.3 },
          ],
        },
      });
      makeChart("chart-eps", {
        type: "bar",
        data: {
          labels: t.epsYears,
          datasets: [{ label: "EPS ($)", data: t.eps, backgroundColor: c.success }],
        },
      });
    } else {
      makeChart("chart-pe", {
        type: "bar",
        data: {
          labels: t.fwdPeLabels,
          datasets: [{ label: "P/E (x)", data: t.fwdPe, backgroundColor: c.warning }],
        },
      });
    }
  }

  let currentTicker = "ibm";
  let currentView = "thesis";

  function parseStartParam() {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.start_param) {
      const p = tg.initDataUnsafe.start_param.toLowerCase();
      if (THESES[p]) return p;
    }
    const q = new URLSearchParams(location.search).get("t");
    if (q && THESES[q]) return q;
    const hash = location.hash.replace("#", "").toLowerCase();
    if (hash && THESES[hash]) return hash;
    return null;
  }

  function syncUrl() {
    const url = new URL(location.href);
    url.searchParams.set("t", currentTicker);
    url.hash = currentView;
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function render() {
    const t = THESES[currentTicker];
    const main = document.getElementById("main");
    main.innerHTML = renderThesis(t, currentView);
    bindCharts(t, currentView);

    if (window.MiniPlot) {
      MiniPlot.mount(currentTicker);
    }

    document.querySelectorAll(".ticker-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.ticker === currentTicker);
    });
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === currentView);
    });
    syncUrl();
  }

  function initTelegram() {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.initData) return;
    tg.ready();
    tg.expand();
    if (tg.colorScheme === "light") {
      document.documentElement.style.setProperty("--bg", "#f4f5f7");
      document.documentElement.style.setProperty("--surface", "#fff");
      document.documentElement.style.setProperty("--text", "#111");
      document.documentElement.style.setProperty("--muted", "#555");
      document.documentElement.style.setProperty("--border", "#ddd");
    }
    tg.BackButton.onClick(() => {
      if (currentView === "valuation") {
        currentView = "thesis";
        render();
      } else {
        tg.close();
      }
    });
    tg.BackButton.show();
  }

  function setupUI() {
    const bar = document.getElementById("top-bar");
    bar.innerHTML = `
      <div class="ticker-row">
        ${TICKER_ORDER.map(
          (id) =>
            `<button type="button" class="ticker-btn" data-ticker="${id}">${TICKER_LABELS[id]}</button>`,
        ).join("")}
      </div>
      <div class="view-row">
        <button type="button" class="view-btn" data-view="thesis">Thesis & fundamentals</button>
        <button type="button" class="view-btn" data-view="valuation">Valuation & scenarios</button>
      </div>
    `;

    bar.addEventListener("click", (e) => {
      const tb = e.target.closest(".ticker-btn");
      const vb = e.target.closest(".view-btn");
      if (tb) {
        currentTicker = tb.dataset.ticker;
        render();
      }
      if (vb) {
        currentView = vb.dataset.view;
        render();
      }
    });
  }

  window.__selectTicker = (id) => {
    if (!THESES[id]) return;
    currentTicker = id;
    render();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const start = parseStartParam();
    if (start) currentTicker = start;
    if (location.hash === "#valuation") currentView = "valuation";
    setupUI();
    initTelegram();
    render();
  });
})();
