/* global */
(function () {
  "use strict";

  const LAYERS = [
    { id: "demand", label: "Demand", sub: "Who the market sees first", tickers: ["NVDA"] },
    { id: "foundry", label: "Foundry & Packaging", sub: "Where chips get built + CoWoS", tickers: ["TSM"] },
    { id: "memory", label: "HBM & Memory", sub: "The 2025 supply bottleneck", tickers: ["000660.KS", "MU"] },
    { id: "equipment", label: "Equipment & Metrology", sub: "Litho, etch, test, yield", tickers: ["ASML", "KLAC", "6920.T", "6857.T", "6146.T", "LRCX", "AMAT", "8035.T", "BESI.AS", "VACN.SW"] },
    { id: "materials", label: "Materials & Substrates", sub: "The hidden monopoly layer", tickers: ["2802.T", "4062.T", "3037.TW", "7741.T", "4063.T", "3436.T", "6488.TWO", "ENTG", "WAF.DE", "AIQUY"] },
    { id: "software", label: "EDA & Software", sub: "No tape-out without it", tickers: ["SNPS", "CDNS"] },
    { id: "osat", label: "OSAT & Assembly", sub: "Outsourced advanced packaging", tickers: ["AMKR", "3711.TW"] },
  ];

  const NODE_ALIASES = {
    NVDA: ["NVIDIA"],
    TSM: ["TSMC", "TSMC CoWoS"],
    ASML: ["ASML EUV"],
    "6857.T": ["Advantest"],
    "6920.T": ["Lasertec"],
    "000660.KS": ["SK hynix"],
    MU: ["Micron"],
    "2802.T": ["Ajinomoto ABF", "Ajinomoto"],
    "4062.T": ["Ibiden"],
    "3037.TW": ["Unimicron"],
    "7741.T": ["HOYA"],
    "4063.T": ["Shin-Etsu Chemical"],
    "3436.T": ["SUMCO"],
    "6488.TWO": ["GlobalWafers"],
    KLAC: ["KLA"],
    LRCX: ["Lam Research"],
    AMAT: ["Applied Materials"],
    "8035.T": ["Tokyo Electron"],
    "6146.T": ["DISCO"],
    "BESI.AS": ["BESI", "BE Semiconductor Industries"],
    "VACN.SW": ["VAT Group"],
    SNPS: ["Synopsys"],
    CDNS: ["Cadence"],
    AMKR: ["Amkor"],
    "3711.TW": ["ASE Technology"],
    "WAF.DE": ["Siltronic"],
    AIQUY: ["Air Liquide"],
    ENTG: ["Entegris"],
  };

  const cache = { model: null, load: null };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function scoreTone(n) { return n >= 5 ? "success" : n >= 4 ? "info" : n >= 3 ? "warning" : "info"; }
  function verdictTone(v) {
    if (v === "interesting") return "success";
    if (v === "maybe") return "info";
    if (v === "supply-chain watchlist") return "warning";
    return "danger";
  }

  function layerOf(ticker) {
    for (let i = 0; i < LAYERS.length; i++) {
      if (LAYERS[i].tickers.indexOf(ticker) !== -1) return LAYERS[i];
    }
    return null;
  }

  function aliasesFor(c) {
    const a = NODE_ALIASES[c.ticker] ? NODE_ALIASES[c.ticker].slice() : [];
    a.push(c.name);
    return a;
  }

  function nodeMatchesCompany(node, c) {
    const al = aliasesFor(c);
    for (let i = 0; i < al.length; i++) if (al[i] === node) return true;
    return false;
  }

  function companyForNode(node, companies) {
    for (let i = 0; i < companies.length; i++) {
      if (nodeMatchesCompany(node, companies[i])) return companies[i];
    }
    return null;
  }

  function edgesFor(c, edges, companies) {
    const up = [];
    const down = [];
    edges.forEach((e) => {
      if (nodeMatchesCompany(e.target_node, c)) up.push(e);
      if (nodeMatchesCompany(e.source_node, c)) down.push(e);
    });
    function uniq(arr) {
      const seen = {};
      const out = [];
      arr.forEach((e) => {
        const k = `${e.source_node}|${e.target_node}|${e.relationship_type}`;
        if (!seen[k]) { seen[k] = 1; out.push(e); }
      });
      return out;
    }
    return { up: uniq(up), down: uniq(down) };
  }

  function isPrivateProxy(c) {
    return /\.(T|TW|KS|DE)$/.test(c.ticker) || c.ticker === "AIQUY";
  }

  function shortExpression(c) {
    const s = c.public_market_expression || "";
    return s.length > 46 ? `${s.slice(0, 45)}…` : s;
  }

  function ensureLoaded() {
    if (cache.model) return Promise.resolve(cache.model);
    if (cache.load) return cache.load;
    cache.load = fetch("ai-chip-stack-model.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((m) => {
        cache.model = m;
        return m;
      })
      .catch((err) => {
        cache.load = null;
        throw err;
      });
    return cache.load;
  }

  function cardHtml(c) {
    const st = scoreTone(c.bottleneck_score);
    const vt = verdictTone(c.verdict);
    const priv = isPrivateProxy(c) ? '<span class="priv-dot" title="non-US / illiquid proxy"></span>' : "";
    return `
      <button type="button" class="thesis-card" data-stack-ticker="${esc(c.ticker)}">
        <div class="thesis-card-head">
          <div class="thesis-card-badge">${esc(c.ticker)}</div>
          <span class="pill-sm ${st} score-pill"><b>${c.bottleneck_score}</b>/5</span>
        </div>
        <div class="thesis-card-title">${priv}${esc(c.name)}</div>
        <div class="thesis-card-meta">${esc(c.where_in_stack)}</div>
        <div class="cat-tags">
          <span class="cat-tag">${esc(c.verdict)}</span>
          <span class="cat-tag">${esc(c.final_action)}</span>
        </div>
        <div class="thesis-card-foot">
          <span class="tc-l">${esc(shortExpression(c))}</span>
          <span class="pill-sm ${vt}">${esc(c.verdict.split(" ")[0])}</span>
        </div>
      </button>`;
  }

  function flowItemHtml(e, dir, companies) {
    const node = dir === "up" ? e.source_node : e.target_node;
    const linked = companyForNode(node, companies);
    const wClass = Number(e.estimated_weight) >= 5 ? "w5" : Number(e.estimated_weight) >= 4 ? "w4" : "";
    const rel = String(e.relationship_type).replace(/_/g, " ");
    const arrow = dir === "up"
      ? '<svg class="flow-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>'
      : '<svg class="flow-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
    return `
      <li>
        <button type="button" class="flow-item" ${linked ? `data-stack-ticker="${esc(linked.ticker)}"` : "disabled"}>
          ${arrow}
          <span class="flow-node">${esc(node)}${linked ? ` · ${esc(linked.ticker)}` : ""}</span>
          <span class="flow-rel">${esc(rel)}</span>
          <span class="flow-w ${wClass}">${esc(e.estimated_weight)}</span>
        </button>
      </li>`;
  }

  function openCompany(ticker, ctx) {
    const m = cache.model;
    if (!m) return;
    const byTicker = {};
    m.companies.forEach((c) => { byTicker[c.ticker] = c; });
    const c = byTicker[ticker];
    if (!c) return;

    const fl = edgesFor(c, m.sankey_edges, m.companies);
    const st = scoreTone(c.bottleneck_score);
    const vt = verdictTone(c.verdict);
    const lyr = layerOf(c.ticker);

    const upHtml = fl.up.length
      ? `<div class="flow-group"><div class="flow-label">Upstream — what feeds it</div><ul class="flow-list">${fl.up.map((e) => flowItemHtml(e, "up", m.companies)).join("")}</ul></div>`
      : "";
    const downHtml = fl.down.length
      ? `<div class="flow-group"><div class="flow-label">Downstream — what it feeds</div><ul class="flow-list">${fl.down.map((e) => flowItemHtml(e, "down", m.companies)).join("")}</ul></div>`
      : "";

    ctx.openSheet(`
      <div class="sheet-title">${esc(c.ticker)} <span class="sheet-meta">· ${esc(c.name)}</span></div>
      <div class="sheet-tags">
        <span class="pill-sm ${st} score-pill"><b>${c.bottleneck_score}</b>/5 bottleneck</span>
        <span class="pill-sm ${vt}">${esc(c.verdict)}</span>
        <span class="pill-sm info">${esc(c.final_action)}</span>
        ${lyr ? `<span class="cat-tag">${esc(lyr.label)}</span>` : ""}
      </div>
      <h3>What it actually does</h3>
      <p class="movers-copy">${esc(c.plain_english_description)}</p>
      <h3>Why it matters now</h3>
      <p class="movers-copy">${esc(c.why_it_matters_now)}</p>
      <h3>Bottleneck read</h3>
      <p class="movers-copy">${esc(c.bottleneck_notes)}</p>
      ${upHtml}${downHtml}
      <h3 style="margin-top:1.1rem">Risk flags</h3>
      <div class="callout danger"><ul>${c.risk_flags.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
      <div class="verdict">
        <div class="verdict-head">Public-market expression <span class="pill-sm info">Verdict</span></div>
        <p>${esc(c.public_market_expression)}</p>
        <div class="verdict-zones"><span class="zone ${vt === "danger" ? "warning" : vt}">${esc(c.final_action)}</span></div>
      </div>
      <h3>Sources</h3>
      <ul class="src-list">${c.key_sources.map((u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></li>`).join("")}</ul>
      <p class="sheet-note">Illustrative supply-chain research, not investment advice. Weights are 1–5 importance scores. ${esc(m.as_of)}.</p>
    `);

    ctx.onOpenCompany?.(ticker);
  }

  function openMethod(ctx) {
    const m = cache.model;
    if (!m) return;
    ctx.openSheet(`
      <div class="sheet-title">Method <span class="sheet-meta">· how this map is built</span></div>
      <p class="sheet-sub">${esc(m.purpose)}</p>
      <h3>Approach</h3><p class="movers-copy">${esc(m.method)}</p>
      <h3>Source policy</h3><p class="movers-copy">${esc(m.source_policy)}</p>
      <p class="sheet-note">Model: ${esc(m.id)} · ${esc(m.as_of)}</p>
    `);
  }

  function renderIndex(ctx) {
    const view = document.getElementById("view");
    view.innerHTML = `
      <section class="screen">
        <div class="empty"><div class="empty-title">Loading supply-chain map…</div></div>
      </section>`;

    return ensureLoaded()
      .then((m) => {
        const filter = ctx.filter || "all";
        const byTicker = {};
        m.companies.forEach((c) => { byTicker[c.ticker] = c; });

        const companies = m.companies.slice();
        const total = companies.length;
        const edgeCount = m.sankey_edges.length;
        const chokes = companies.filter((c) => c.bottleneck_score >= 5).length;
        const hidden = companies.filter((c) => c.verdict === "supply-chain watchlist").length;

        const chips = [{ id: "all", label: "All" }].concat(LAYERS.map((l) => ({ id: l.id, label: l.label })));
        const chipHtml = chips.map((ch) =>
          `<button type="button" class="filter-chip${filter === ch.id ? " active" : ""}" data-stack-filter="${ch.id}">${esc(ch.label)}</button>`
        ).join("");

        const layersToShow = filter === "all" ? LAYERS : LAYERS.filter((l) => l.id === filter);

        const stackHtml = layersToShow.map((l, idx) => {
          const num = filter === "all" ? (idx + 1) : (LAYERS.indexOf(l) + 1);
          const cards = l.tickers
            .map((t) => byTicker[t])
            .filter(Boolean)
            .sort((a, b) => b.bottleneck_score - a.bottleneck_score)
            .map(cardHtml)
            .join("");
          return `
            <div class="layer-head">
              <span class="layer-num">${String(num).padStart(2, "0")}</span>
              <span class="layer-title">${esc(l.label)}</span>
              <span class="layer-sub">${esc(l.sub)}</span>
            </div>
            <div class="thesis-grid">${cards}</div>`;
        }).join("");

        view.innerHTML = `
          <section class="screen">
            <div class="stack-hero">
              <span class="badge">Supply-chain map · ${esc(m.as_of)}</span>
              <h1>The bottlenecks behind the AI chip</h1>
              <p class="lead">${esc(m.canonical_thesis)}</p>
              <div class="stats">
                <div class="stat"><div class="val">${total}</div><div class="lbl">Companies mapped</div></div>
                <div class="stat"><div class="val">${edgeCount}</div><div class="lbl">Dependency links</div></div>
                <div class="stat"><div class="val success">${chokes}</div><div class="lbl">5/5 choke points</div></div>
                <div class="stat"><div class="val warning">${hidden}</div><div class="lbl">Hidden plays</div></div>
              </div>
            </div>
            <div class="filter-block">
              <div class="filter-row wrap" id="stack-filter-row">${chipHtml}</div>
            </div>
            ${stackHtml}
            <section class="movers">
              <div class="movers-head">How to read this</div>
              <p class="movers-copy">Start at <strong>Demand</strong> (the obvious name) and follow the stack down. Each card is scored 1–5 on how much of a real bottleneck it is. Tap any card for the plain-English dive, why it matters now, risk flags, sources, and the <strong>upstream/downstream flow</strong> — tap a linked node to jump across the supply chain.</p>
            </section>
          </section>`;

        document.querySelectorAll("#stack-filter-row [data-stack-filter]").forEach((btn) => {
          btn.addEventListener("click", () => {
            ctx.setFilter(btn.dataset.stackFilter);
          });
        });

        view.querySelectorAll("[data-stack-ticker]").forEach((btn) => {
          btn.addEventListener("click", () => openCompany(btn.dataset.stackTicker, ctx));
        });

        if (ctx.deepTicker && byTicker[ctx.deepTicker]) {
          const t = ctx.deepTicker;
          openCompany(t, ctx);
          ctx.onDeepLinkConsumed?.(t);
        }
      })
      .catch((err) => {
        view.innerHTML = `
          <section class="screen">
            <div class="empty">
              <div class="empty-title">Could not load model</div>
              <div class="empty-sub">Check that ai-chip-stack-model.json is deployed with the app.</div>
            </div>
            <p class="footnote">${esc(err.message)}</p>
          </section>`;
      });
  }

  window.ChipStack = {
    ensureLoaded,
    renderIndex,
    openCompany,
    openMethod,
    scrollTop(ctx) {
      ctx.setFilter("all");
      document.getElementById("view").scrollTo({ top: 0, behavior: "smooth" });
      ctx.toast("Showing full stack");
    },
  };
})();
