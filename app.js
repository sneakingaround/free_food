/* global THESES, TICKER_ORDER, TICKER_LABELS, TICKER_META, DEFAULT_WATCHLIST,
   pt, fmtPct, weightedPT, upside, Chart, MiniPlot */
(function () {
  // -------------------- Store --------------------
  const STORE_KEY = "ff.v1";
  const defaults = () => ({
    watchlist: DEFAULT_WATCHLIST.slice(),
    activeThesis: "ibm",
    thesisView: "thesis", // "thesis" | "valuation"
    alerts: [],
  });

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return { ...defaults(), ...parsed };
    } catch {
      return defaults();
    }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
  }
  const state = loadStore();

  // -------------------- Toast --------------------
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  // -------------------- Sheet --------------------
  function openSheet(html) {
    const sheet = document.getElementById("sheet");
    document.getElementById("sheet-content").innerHTML = html;
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
  }
  function closeSheet() {
    const sheet = document.getElementById("sheet");
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
  }
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) {
      closeSheet();
      closeDrawer();
    }
  });

  // -------------------- Drawer --------------------
  function openDrawer() {
    const d = document.getElementById("drawer");
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    const d = document.getElementById("drawer");
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
  }

  // -------------------- Charts (Chart.js) --------------------
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
      plugins: { legend: { labels: { color: c.text, boxWidth: 12, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: c.muted, maxRotation: 45, font: { size: 10 } }, grid: { color: c.grid } },
        y: { ticks: { color: c.muted, font: { size: 10 } }, grid: { color: c.grid } },
      },
    };
    chartInstances.push(new Chart(el, { ...config, options: { ...base, ...(config.options || {}) } }));
  }

  // -------------------- Router --------------------
  // routes: #/markets, #/theses, #/theses/<id>, #/theses/<id>/valuation, #/alerts, #/settings
  function parseRoute() {
    const h = location.hash || "";
    // Legacy support: ?t=ibm#thesis or #valuation
    const legacyView = (h === "#thesis" || h === "#valuation") ? h.slice(1) : null;
    const legacyTicker = new URLSearchParams(location.search).get("t");
    if (legacyTicker && THESES[legacyTicker.toLowerCase()]) {
      const v = legacyView === "valuation" ? "/valuation" : "";
      return { tab: "theses", thesisId: legacyTicker.toLowerCase(), thesisView: legacyView === "valuation" ? "valuation" : "thesis", _redirect: `#/theses/${legacyTicker.toLowerCase()}${v}` };
    }
    const parts = h.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts.length === 0) return { tab: "markets" };
    const [head, a, b] = parts;
    if (head === "markets") return { tab: "markets" };
    if (head === "alerts") return { tab: "alerts" };
    if (head === "settings") return { tab: "settings" };
    if (head === "theses") {
      if (!a) return { tab: "theses" };
      if (!THESES[a]) return { tab: "theses" };
      return { tab: "theses", thesisId: a, thesisView: b === "valuation" ? "valuation" : "thesis" };
    }
    return { tab: "markets" };
  }

  function navigate(hash, opts) {
    const replace = !!(opts && opts.replace);
    const url = new URL(location.href);
    url.search = ""; // drop legacy ?t=
    url.hash = hash;
    if (replace) history.replaceState(null, "", url);
    else history.pushState(null, "", url);
    render();
  }

  // -------------------- Header --------------------
  function setHeader(title, action) {
    document.getElementById("header-title").textContent = title;
    const btn = document.getElementById("btn-action");
    btn.innerHTML = "";
    if (!action) {
      btn.style.visibility = "hidden";
      btn.onclick = null;
      return;
    }
    btn.style.visibility = "visible";
    btn.innerHTML = action.icon;
    btn.setAttribute("aria-label", action.label || "");
    btn.onclick = action.onClick;
  }

  // -------------------- Drawer nav --------------------
  function renderDrawerNav(activeTab) {
    const items = [
      { id: "markets",  label: "Markets",  hint: "Your watchlist" },
      { id: "theses",   label: "Theses",   hint: "Deep-dive reports" },
      { id: "alerts",   label: "Alerts",   hint: "Price + thesis" },
      { id: "settings", label: "Settings", hint: "Preferences" },
    ];
    document.getElementById("drawer-nav").innerHTML = items.map((it) => `
      <button type="button" class="drawer-item${activeTab === it.id ? " active" : ""}" data-nav="${it.id}">
        <div class="drawer-item-main">
          <div class="drawer-item-label">${it.label}</div>
          <div class="drawer-item-hint">${it.hint}</div>
        </div>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    `).join("");
  }

  // -------------------- Views: Markets / Watchlist --------------------
  function renderMarkets() {
    const wl = state.watchlist.filter((id) => TICKER_META[id]);
    const empty = wl.length === 0;
    const html = `
      <section class="screen">
        <div class="screen-head">
          <div>
            <div class="screen-title">Watchlist</div>
            <div class="screen-sub">${wl.length} ticker${wl.length === 1 ? "" : "s"} · 6mo daily · Yahoo Finance</div>
          </div>
          <button type="button" class="ghost-btn" id="btn-refresh">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 4v5h-5"/></svg>
            Refresh
          </button>
        </div>

        ${empty ? `
          <div class="empty">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 4 7-9"/><path d="M14 7h5v5"/></svg>
            </div>
            <div class="empty-title">Your watchlist is empty</div>
            <div class="empty-sub">Add a ticker to start tracking price and thesis updates.</div>
            <button type="button" class="primary-btn" id="btn-empty-add">Add ticker</button>
          </div>
        ` : `
          <ul class="rows" id="watchlist-rows">
            ${wl.map(rowSkeleton).join("")}
          </ul>
          <button type="button" class="row-add" id="btn-add-row">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Add ticker
          </button>
        `}

        <section class="movers">
          <div class="movers-head">Theses with data</div>
          <div class="chips">
            ${TICKER_ORDER.map((id) => `
              <button type="button" class="chip" data-open-thesis="${id}">
                <span class="chip-sym">${TICKER_LABELS[id]}</span>
                <span class="chip-name">${TICKER_META[id].name.split(" ").slice(0, 2).join(" ")}</span>
              </button>
            `).join("")}
          </div>
        </section>
      </section>
    `;
    document.getElementById("view").innerHTML = html;

    setHeader("Markets", {
      label: "Add ticker",
      icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
      onClick: openAddTickerSheet,
    });

    document.getElementById("btn-add-row")?.addEventListener("click", openAddTickerSheet);
    document.getElementById("btn-empty-add")?.addEventListener("click", openAddTickerSheet);
    document.getElementById("btn-refresh")?.addEventListener("click", () => {
      hydrateWatchlist(true);
      toast("Refreshed");
    });

    document.querySelectorAll("[data-open-thesis]").forEach((el) => {
      el.addEventListener("click", () => navigate(`#/theses/${el.dataset.openThesis}`));
    });
    document.querySelectorAll("[data-row]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-row-action]")) return;
        const id = row.dataset.row;
        if (TICKER_META[id]?.hasThesis) navigate(`#/theses/${id}`);
        else openQuoteSheet(id);
      });
    });
    document.querySelectorAll("[data-row-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.closest("[data-row]").dataset.row;
        openRowActionSheet(id);
      });
    });

    hydrateWatchlist(false);
  }

  function rowSkeleton(id) {
    const m = TICKER_META[id];
    return `
      <li class="row" data-row="${id}">
        <div class="row-badge">${m.symbol}</div>
        <div class="row-main">
          <div class="row-name">${m.name}</div>
          <div class="row-sub">${m.exchange} · ${m.sector}</div>
        </div>
        <div class="row-spark"><canvas class="spark-canvas" data-spark="${id}" height="34"></canvas></div>
        <div class="row-right">
          <div class="row-price" data-price="${id}">—</div>
          <div class="row-change" data-change="${id}">—</div>
        </div>
        <button type="button" class="row-more" data-row-action aria-label="More">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>
        </button>
      </li>
    `;
  }

  async function hydrateWatchlist(refetch) {
    if (!window.MiniPlot) return;
    const ids = state.watchlist.filter((id) => TICKER_META[id]);
    await Promise.all(ids.map((id) => hydrateRow(id, refetch)));
  }

  async function hydrateRow(id) {
    try {
      const data = await MiniPlot.loadBars(id);
      const bars = data.bars;
      const last = bars.at(-1).c;
      const prev = bars.at(-2)?.c ?? bars[0].c;
      const dayChg = ((last - prev) / prev) * 100;
      const halfChg = ((last - bars[0].c) / bars[0].c) * 100;
      const priceEl = document.querySelector(`[data-price="${id}"]`);
      const chgEl = document.querySelector(`[data-change="${id}"]`);
      if (priceEl) priceEl.textContent = `$${last.toFixed(2)}`;
      if (chgEl) {
        const sign = dayChg >= 0 ? "+" : "";
        chgEl.textContent = `${sign}${dayChg.toFixed(2)}%`;
        chgEl.classList.toggle("up", dayChg >= 0);
        chgEl.classList.toggle("down", dayChg < 0);
        chgEl.title = `6mo ${halfChg >= 0 ? "+" : ""}${halfChg.toFixed(1)}%`;
      }
      const canvas = document.querySelector(`[data-spark="${id}"]`);
      if (canvas) {
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        MiniPlot.drawSparkline(canvas, bars);
      }
    } catch {
      const priceEl = document.querySelector(`[data-price="${id}"]`);
      const chgEl = document.querySelector(`[data-change="${id}"]`);
      if (priceEl) priceEl.textContent = "—";
      if (chgEl) chgEl.textContent = "no data";
    }
  }

  // -------------------- Add ticker / Row actions sheets --------------------
  function openAddTickerSheet() {
    const present = new Set(state.watchlist);
    const available = TICKER_ORDER.filter((id) => !present.has(id));
    const body = `
      <div class="sheet-title">Add to watchlist</div>
      <div class="sheet-sub">Tickers with thesis + 6mo market data.</div>
      <ul class="picker">
        ${available.length === 0 ? `<li class="picker-empty">All available tickers already on your watchlist.</li>` :
          available.map((id) => {
            const m = TICKER_META[id];
            return `
              <li class="picker-row" data-add="${id}">
                <div class="row-badge">${m.symbol}</div>
                <div class="row-main">
                  <div class="row-name">${m.name}</div>
                  <div class="row-sub">${m.exchange} · ${m.sector}</div>
                </div>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </li>
            `;
          }).join("")}
      </ul>
      <div class="sheet-note">More tickers coming — drop a request in the GitHub repo.</div>
    `;
    openSheet(body);
    document.querySelectorAll("[data-add]").forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.dataset.add;
        if (!state.watchlist.includes(id)) state.watchlist.push(id);
        saveStore();
        closeSheet();
        toast(`${TICKER_LABELS[id]} added`);
        renderMarkets();
      });
    });
  }

  function openRowActionSheet(id) {
    const m = TICKER_META[id];
    openSheet(`
      <div class="sheet-title">${m.name}</div>
      <div class="sheet-sub">${m.symbol} · ${m.exchange}</div>
      <ul class="action-list">
        ${m.hasThesis ? `<li><button type="button" class="action-btn" data-action="thesis">Open investment thesis</button></li>` : ""}
        <li><button type="button" class="action-btn" data-action="quote">Quick quote</button></li>
        <li><button type="button" class="action-btn destructive" data-action="remove">Remove from watchlist</button></li>
      </ul>
    `);
    document.querySelector('[data-action="thesis"]')?.addEventListener("click", () => { closeSheet(); navigate(`#/theses/${id}`); });
    document.querySelector('[data-action="quote"]')?.addEventListener("click", () => { closeSheet(); openQuoteSheet(id); });
    document.querySelector('[data-action="remove"]')?.addEventListener("click", () => {
      state.watchlist = state.watchlist.filter((x) => x !== id);
      saveStore();
      closeSheet();
      toast(`${TICKER_LABELS[id]} removed`);
      renderMarkets();
    });
  }

  async function openQuoteSheet(id) {
    const m = TICKER_META[id];
    openSheet(`
      <div class="sheet-title">${m.symbol} <span class="sheet-meta">· ${m.name}</span></div>
      <div class="sheet-sub">Loading market data…</div>
      <div class="quote-stats" id="quote-stats"></div>
    `);
    try {
      const { bars } = await MiniPlot.loadBars(id);
      const last = bars.at(-1).c;
      const prev = bars.at(-2)?.c ?? bars[0].c;
      const dayChg = ((last - prev) / prev) * 100;
      const halfChg = ((last - bars[0].c) / bars[0].c) * 100;
      const hi = Math.max(...bars.map((b) => b.h));
      const lo = Math.min(...bars.map((b) => b.l));
      const vol = bars.at(-1).v;
      document.querySelector(".sheet-sub").textContent = `${m.exchange} · ${m.sector} · 6mo daily`;
      document.getElementById("quote-stats").innerHTML = `
        <div class="qs"><div class="qs-l">Last</div><div class="qs-v">$${last.toFixed(2)}</div></div>
        <div class="qs"><div class="qs-l">Day</div><div class="qs-v ${dayChg >= 0 ? "up" : "down"}">${dayChg >= 0 ? "+" : ""}${dayChg.toFixed(2)}%</div></div>
        <div class="qs"><div class="qs-l">6mo</div><div class="qs-v ${halfChg >= 0 ? "up" : "down"}">${halfChg >= 0 ? "+" : ""}${halfChg.toFixed(1)}%</div></div>
        <div class="qs"><div class="qs-l">6mo high</div><div class="qs-v">$${hi.toFixed(2)}</div></div>
        <div class="qs"><div class="qs-l">6mo low</div><div class="qs-v">$${lo.toFixed(2)}</div></div>
        <div class="qs"><div class="qs-l">Last volume</div><div class="qs-v">${(vol / 1e6).toFixed(2)}M</div></div>
      `;
    } catch {
      document.querySelector(".sheet-sub").textContent = "Market data unavailable.";
    }
  }

  // -------------------- Views: Theses index --------------------
  function renderThesesIndex() {
    const cards = TICKER_ORDER.map((id) => {
      const t = THESES[id];
      const w = weightedPT(t);
      const up = upside(t.price, w);
      const tone = up >= 5 ? "success" : up <= -5 ? "danger" : "info";
      const upClass = up >= 0 ? "up" : "down";
      return `
        <button type="button" class="thesis-card" data-thesis="${id}">
          <div class="thesis-card-head">
            <div class="thesis-card-badge">${t.ticker.split(" ")[0]}</div>
            <span class="pill-sm ${tone}">${up >= 0 ? "+" : ""}${up.toFixed(0)}% PT</span>
          </div>
          <div class="thesis-card-title">${t.title.split(":")[1]?.trim() || t.title}</div>
          <div class="thesis-card-meta">${TICKER_META[id].name} · ${TICKER_META[id].exchange}</div>
          <div class="thesis-card-foot">
            <span class="tc-l">Spot $${t.id === "ibm" ? t.price.toFixed(0) : t.price.toFixed(2)}</span>
            <span class="tc-arrow ${upClass}">→ $${t.id === "ibm" ? w.toFixed(0) : w.toFixed(2)}</span>
          </div>
        </button>
      `;
    }).join("");
    document.getElementById("view").innerHTML = `
      <section class="screen">
        <div class="screen-head">
          <div>
            <div class="screen-title">Investment theses</div>
            <div class="screen-sub">${TICKER_ORDER.length} deep dives · scenario-weighted price targets</div>
          </div>
        </div>
        <div class="thesis-grid">${cards}</div>
        <section class="movers">
          <div class="movers-head">About the framework</div>
          <p class="movers-copy">Each thesis carries four load-bearing pillars, a scenario table (bear / base / bull) with author EPS × exit multiple, and a verdict band with entry zones. The weighted PT pill on each card is the probability-weighted target vs the spot price.</p>
        </section>
      </section>
    `;
    setHeader("Theses", null);
    document.querySelectorAll("[data-thesis]").forEach((b) => {
      b.addEventListener("click", () => navigate(`#/theses/${b.dataset.thesis}`));
    });
  }

  // -------------------- Views: Thesis Detail (existing) --------------------
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
    stats.push({ v: fmtPct(wup), l: "Prob-weighted PT", tone: wup >= 0 ? "success" : "danger" });
    return stats.map((s) => {
      const tone = s.tone ? ` ${s.tone}` : "";
      return `<div class="stat"><div class="val${tone}">${s.v}</div><div class="lbl">${s.l}</div></div>`;
    }).join("");
  }
  function renderTable(t) {
    const rows = t.scenarios.map((s) => {
      const target = pt(s);
      const up = upside(t.price, target);
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
    }).join("");
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
    items.push(`<div class="stat"><div class="val ${upside(t.price, w) >= 0 ? "success" : "danger"}">$${t.id === "ibm" ? w.toFixed(0) : w.toFixed(2)}</div><div class="lbl">Weighted PT</div></div>`);
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
      ${renderTable(t)}
      <div class="stats" style="grid-template-columns:repeat(2,1fr)">${renderScenarioStats(t)}</div>
      <h3>Forward P/E</h3>
      <div class="chart-box"><canvas id="chart-pe"></canvas></div>
      <p class="caption">Y: P/E (x). Source: Godel EM.</p>
      <div class="grid-2">
        <div><h3>Catalysts (long)</h3>${renderCallout("What extends the re-rate", t.catalysts, "success")}</div>
        <div><h3>Risks (short)</h3>${renderCallout("What breaks the thesis", t.risks, "danger")}</div>
      </div>`;
  }
  function renderThesisDetail(id, view) {
    const t = THESES[id];
    const wpt = weightedPT(t);
    const wup = upside(t.price, wpt);
    const tabBody = view === "valuation" ? renderValuation(t) : renderThesisFundamentals(t);
    document.getElementById("view").innerHTML = `
      <section class="screen">
        <button type="button" class="back-btn" id="btn-back-theses">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          All theses
        </button>
        <span class="badge">${t.ticker}</span>
        <p class="meta">${t.meta}</p>
        <h1>${t.title}</h1>
        <p class="lead">${t.lead}</p>
        <div class="stats">${renderStats(t, wpt, wup)}</div>

        <div class="view-row" id="thesis-view-row">
          <button type="button" class="view-btn${view === "thesis" ? " active" : ""}" data-view="thesis">Thesis & fundamentals</button>
          <button type="button" class="view-btn${view === "valuation" ? " active" : ""}" data-view="valuation">Valuation & scenarios</button>
        </div>

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
      </section>
    `;
    destroyCharts();
    const c = chartColors();
    if (view === "thesis") {
      makeChart("chart-rev", {
        type: "line",
        data: { labels: t.revenueYears, datasets: [{ label: "Revenue ($B)", data: t.revenue, borderColor: c.info, backgroundColor: "rgba(110,168,254,0.15)", fill: true, tension: 0.3 }] },
      });
      makeChart("chart-margin", {
        type: "line",
        data: { labels: t.revenueYears, datasets: [
          { label: "Operating %", data: t.opMargin, borderColor: c.success, tension: 0.3 },
          { label: "Net %", data: t.netMargin, borderColor: c.info, tension: 0.3 },
        ] },
      });
      makeChart("chart-eps", {
        type: "bar",
        data: { labels: t.epsYears, datasets: [{ label: "EPS ($)", data: t.eps, backgroundColor: c.success }] },
      });
    } else {
      makeChart("chart-pe", {
        type: "bar",
        data: { labels: t.fwdPeLabels, datasets: [{ label: "P/E (x)", data: t.fwdPe, backgroundColor: c.warning }] },
      });
    }
    if (window.MiniPlot) MiniPlot.mount(id);

    document.getElementById("btn-back-theses").addEventListener("click", () => navigate("#/theses"));
    document.querySelectorAll("#thesis-view-row .view-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.view;
        state.thesisView = v;
        saveStore();
        navigate(`#/theses/${id}${v === "valuation" ? "/valuation" : ""}`, { replace: true });
      });
    });

    const inWatch = state.watchlist.includes(id);
    setHeader(TICKER_LABELS[id], {
      label: inWatch ? "Remove from watchlist" : "Add to watchlist",
      icon: inWatch
        ? `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.6" stroke-linejoin="round"><path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62L22 9.24l-5.46 4.73L18.18 21z"/></svg>`
        : `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62L22 9.24l-5.46 4.73L18.18 21z"/></svg>`,
      onClick: () => {
        if (state.watchlist.includes(id)) state.watchlist = state.watchlist.filter((x) => x !== id);
        else state.watchlist.push(id);
        saveStore();
        toast(state.watchlist.includes(id) ? `${TICKER_LABELS[id]} added` : `${TICKER_LABELS[id]} removed`);
        renderThesisDetail(id, view);
      },
    });
  }

  // -------------------- Views: Alerts --------------------
  function renderAlerts() {
    document.getElementById("view").innerHTML = `
      <section class="screen">
        <div class="screen-head">
          <div>
            <div class="screen-title">Alerts</div>
            <div class="screen-sub">Price levels and thesis triggers</div>
          </div>
        </div>
        <div class="empty">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1112 0c0 6 3 7 3 7H3s3-1 3-7z"/><path d="M10 21a2 2 0 004 0"/></svg>
          </div>
          <div class="empty-title">No alerts yet</div>
          <div class="empty-sub">Once we wire live quotes, set price alerts at the verdict zones from each thesis (e.g. <em>IBM &lt; $275 → strong buy</em>).</div>
          <button type="button" class="primary-btn" id="alerts-go-theses">Browse theses</button>
        </div>

        <section class="movers">
          <div class="movers-head">Verdict zones in your watchlist</div>
          <ul class="zone-list">
            ${state.watchlist.filter((id) => TICKER_META[id]?.hasThesis).map((id) => {
              const t = THESES[id];
              return `<li class="zone-item">
                <div class="zone-sym">${TICKER_LABELS[id]}</div>
                <div class="zone-zones">${t.zones.map((z) => `<span class="zone ${z.tone}">${z.text}</span>`).join("")}</div>
              </li>`;
            }).join("") || `<li class="zone-empty">Add a ticker to your watchlist to see its entry zones.</li>`}
          </ul>
        </section>
      </section>
    `;
    setHeader("Alerts", null);
    document.getElementById("alerts-go-theses")?.addEventListener("click", () => navigate("#/theses"));
  }

  // -------------------- Views: Settings --------------------
  function renderSettings() {
    document.getElementById("view").innerHTML = `
      <section class="screen">
        <div class="screen-head">
          <div>
            <div class="screen-title">Settings</div>
            <div class="screen-sub">Preferences & data</div>
          </div>
        </div>

        <ul class="settings">
          <li class="settings-row">
            <div class="settings-l">
              <div class="settings-label">Watchlist</div>
              <div class="settings-hint">${state.watchlist.length} ticker${state.watchlist.length === 1 ? "" : "s"} stored locally on this device</div>
            </div>
            <button type="button" class="ghost-btn" id="reset-wl">Reset to defaults</button>
          </li>
          <li class="settings-row">
            <div class="settings-l">
              <div class="settings-label">Market data</div>
              <div class="settings-hint">Yahoo Finance · 6mo daily OHLCV · refreshed on each deploy via GitHub Actions.</div>
            </div>
          </li>
          <li class="settings-row">
            <div class="settings-l">
              <div class="settings-label">Telegram WebApp</div>
              <div class="settings-hint">${window.Telegram?.WebApp?.initData ? "Detected — auto-themes to bot palette." : "Not detected (browser mode)."}</div>
            </div>
          </li>
          <li class="settings-row">
            <div class="settings-l">
              <div class="settings-label">About</div>
              <div class="settings-hint">Free Food · v0.2 · MIT · <a href="https://github.com/sneakingaround/free_food" target="_blank" rel="noopener">source</a></div>
            </div>
          </li>
        </ul>

        <div class="settings-disclaimer">Illustrative model for discussion, not investment advice. All thesis scenarios (EPS × exit multiple) are author assumptions, not estimates.</div>
      </section>
    `;
    setHeader("Settings", null);
    document.getElementById("reset-wl").addEventListener("click", () => {
      state.watchlist = DEFAULT_WATCHLIST.slice();
      saveStore();
      toast("Watchlist reset");
      renderSettings();
    });
  }

  // -------------------- Render dispatcher --------------------
  function render() {
    const r = parseRoute();
    if (r._redirect) {
      navigate(r._redirect, { replace: true });
      return;
    }
    renderDrawerNav(r.tab);
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === r.tab));

    if (r.tab === "markets") renderMarkets();
    else if (r.tab === "theses") {
      if (r.thesisId) renderThesisDetail(r.thesisId, r.thesisView);
      else renderThesesIndex();
    }
    else if (r.tab === "alerts") renderAlerts();
    else if (r.tab === "settings") renderSettings();

    // Update Telegram back button visibility
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const inDetail = r.tab === "theses" && r.thesisId;
      if (inDetail) tg.BackButton.show(); else tg.BackButton.hide();
    }
  }

  // -------------------- Init --------------------
  function bindShell() {
    document.getElementById("btn-drawer").addEventListener("click", openDrawer);
    document.getElementById("tabbar").addEventListener("click", (e) => {
      const t = e.target.closest(".tab");
      if (!t) return;
      navigate(`#/${t.dataset.tab}`);
    });
    document.getElementById("drawer-nav").addEventListener("click", (e) => {
      const it = e.target.closest("[data-nav]");
      if (!it) return;
      closeDrawer();
      navigate(`#/${it.dataset.nav}`);
    });
    window.addEventListener("hashchange", render);
    window.addEventListener("popstate", render);
  }

  function initTelegram() {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.initData) return;
    tg.ready();
    tg.expand();
    tg.BackButton.onClick(() => {
      const r = parseRoute();
      if (r.tab === "theses" && r.thesisId) navigate("#/theses");
      else tg.close();
    });
    if (tg.colorScheme === "light") {
      const r = document.documentElement.style;
      r.setProperty("--bg", "#f4f5f7");
      r.setProperty("--bg-elev", "#fff");
      r.setProperty("--surface", "#fff");
      r.setProperty("--surface-2", "#f7f8fa");
      r.setProperty("--text", "#111");
      r.setProperty("--muted", "#555");
      r.setProperty("--border", "#ddd");
      r.setProperty("--border-soft", "#e7e8ec");
    }
    // Use start_param if present (legacy bot deep link)
    const sp = tg?.initDataUnsafe?.start_param?.toLowerCase();
    if (sp && THESES[sp]) navigate(`#/theses/${sp}`, { replace: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindShell();
    initTelegram();
    render();
  });
})();
