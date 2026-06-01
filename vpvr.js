/* global TICKER_LABELS */
window.MiniPlot = (function () {
  const cache = new Map();
  const COLORS = {
    bg: "#181b24",
    grid: "#2a3142",
    text: "#8b95a8",
    up: "#3dd68c",
    down: "#f87171",
    wick: "#8b95a8",
    poc: "#fbbf24",
    va: "rgba(110, 168, 254, 0.12)",
    last: "#e8ecf4",
    volUp: "rgba(61, 214, 140, 0.55)",
    volDown: "rgba(248, 113, 113, 0.55)",
  };

  function computeVPVR(bars, numBins) {
    if (!bars.length) return null;
    const n = numBins || 28;
    let minP = Infinity;
    let maxP = -Infinity;
    for (const b of bars) {
      minP = Math.min(minP, b.l);
      maxP = Math.max(maxP, b.h);
    }
    if (maxP <= minP) maxP = minP + 1;
    const step = (maxP - minP) / n;
    const vol = new Float64Array(n);

    for (const b of bars) {
      const v = b.v || 0;
      if (v <= 0) continue;
      let i0 = Math.floor((b.l - minP) / step);
      let i1 = Math.floor((b.h - minP) / step);
      i0 = Math.max(0, Math.min(n - 1, i0));
      i1 = Math.max(0, Math.min(n - 1, i1));
      const slice = v / (i1 - i0 + 1);
      for (let i = i0; i <= i1; i++) vol[i] += slice;
    }

    const bins = [];
    let total = 0;
    let maxVol = 0;
    let pocIdx = 0;
    for (let i = 0; i < n; i++) {
      total += vol[i];
      if (vol[i] > maxVol) {
        maxVol = vol[i];
        pocIdx = i;
      }
      bins.push({
        mid: minP + (i + 0.5) * step,
        low: minP + i * step,
        high: minP + (i + 1) * step,
        vol: vol[i],
      });
    }

    const target = total * 0.7;
    let acc = bins[pocIdx].vol;
    let lo = pocIdx;
    let hi = pocIdx;
    while (acc < target && (lo > 0 || hi < n - 1)) {
      const down = lo > 0 ? bins[lo - 1].vol : -1;
      const up = hi < n - 1 ? bins[hi + 1].vol : -1;
      if (up >= down && hi < n - 1) {
        hi++;
        acc += bins[hi].vol;
      } else if (lo > 0) {
        lo--;
        acc += bins[lo].vol;
      } else break;
    }

    return {
      bins,
      minP,
      maxP,
      poc: bins[pocIdx].mid,
      val: bins[lo].low,
      vah: bins[hi].high,
      maxVol,
    };
  }

  async function loadBars(id) {
    if (cache.has(id)) return cache.get(id);
    const res = await fetch(`market/${id}.json`);
    if (!res.ok) throw new Error(`market/${id}.json`);
    const data = await res.json();
    cache.set(id, data);
    return data;
  }

  function priceY(p, minP, maxP, top, bottom) {
    return bottom - ((p - minP) / (maxP - minP)) * (bottom - top);
  }

  function draw(canvas, bars, label) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(canvas.parentElement?.clientWidth || 0, 280);
    const H = canvas.clientHeight || 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    if (!bars.length) {
      ctx.fillStyle = COLORS.text;
      ctx.font = "12px system-ui,sans-serif";
      ctx.fillText("No market data", 12, H / 2);
      return;
    }

    const vp = computeVPVR(bars, 28);
    const padL = 4;
    const padR = 4;
    const padT = 18;
    const padB = 14;
    const vpW = Math.floor(W * 0.2);
    const chartL = padL;
    const chartR = W - vpW - padR;
    const volH = Math.floor((H - padT - padB) * 0.24);
    const splitGap = 4;
    const priceB = H - padB - volH - splitGap;
    const volT = priceB + splitGap;
    const volB = H - padB;
    const minP = vp.minP;
    const maxP = vp.maxP;
    const n = bars.length;
    const slot = (chartR - chartL) / n;
    const bodyW = Math.max(1, Math.min(4, slot * 0.65));
    let maxBarVol = 0;
    for (const b of bars) maxBarVol = Math.max(maxBarVol, b.v || 0);

    // Value area (price pane)
    ctx.fillStyle = COLORS.va;
    ctx.fillRect(
      chartL,
      priceY(vp.vah, minP, maxP, padT, priceB),
      chartR - chartL,
      priceY(vp.val, minP, maxP, padT, priceB) - priceY(vp.vah, minP, maxP, padT, priceB),
    );

    // Price grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padT + ((priceB - padT) * i) / 3;
      ctx.beginPath();
      ctx.moveTo(chartL, y);
      ctx.lineTo(chartR, y);
      ctx.stroke();
    }

    // Candles
    for (let i = 0; i < n; i++) {
      const b = bars[i];
      const x = chartL + i * slot + slot / 2;
      const up = b.c >= b.o;
      const yO = priceY(b.o, minP, maxP, padT, priceB);
      const yC = priceY(b.c, minP, maxP, padT, priceB);
      const yH = priceY(b.h, minP, maxP, padT, priceB);
      const yL = priceY(b.l, minP, maxP, padT, priceB);
      ctx.strokeStyle = COLORS.wick;
      ctx.beginPath();
      ctx.moveTo(x, yH);
      ctx.lineTo(x, yL);
      ctx.stroke();
      ctx.fillStyle = up ? COLORS.up : COLORS.down;
      const top = Math.min(yO, yC);
      ctx.fillRect(x - bodyW / 2, top, bodyW, Math.max(1, Math.abs(yC - yO)));
    }

    // POC
    const yPoc = priceY(vp.poc, minP, maxP, padT, priceB);
    ctx.strokeStyle = COLORS.poc;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(chartL, yPoc);
    ctx.lineTo(chartR + vpW, yPoc);
    ctx.stroke();
    ctx.setLineDash([]);

    // Last price
    const last = bars[n - 1].c;
    ctx.strokeStyle = COLORS.last;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(chartL, priceY(last, minP, maxP, padT, priceB));
    ctx.lineTo(chartR, priceY(last, minP, maxP, padT, priceB));
    ctx.stroke();
    ctx.globalAlpha = 1;

    // VPVR
    const vpL = chartR + 2;
    const vpR = W - padR;
    for (const bin of vp.bins) {
      if (bin.vol <= 0) continue;
      const bw = ((vpR - vpL) * bin.vol) / (vp.maxVol || 1);
      const y0 = priceY(bin.high, minP, maxP, padT, priceB);
      const y1 = priceY(bin.low, minP, maxP, padT, priceB);
      const intensity = bin.vol / (vp.maxVol || 1);
      ctx.fillStyle =
        bin.mid >= vp.val && bin.mid <= vp.vah
          ? `rgba(110,168,254,${0.35 + intensity * 0.5})`
          : `rgba(110,168,254,${0.12 + intensity * 0.35})`;
      ctx.fillRect(vpR - bw, y0, bw, Math.max(1, y1 - y0));
    }

    // Volume pane divider
    ctx.strokeStyle = COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(chartL, volT - 2);
    ctx.lineTo(chartR, volT - 2);
    ctx.stroke();

    // Normal volume bars
    for (let i = 0; i < n; i++) {
      const b = bars[i];
      const v = b.v || 0;
      const x = chartL + i * slot + slot / 2;
      const barH = maxBarVol > 0 ? (v / maxBarVol) * (volB - volT - 4) : 0;
      const up = b.c >= b.o;
      ctx.fillStyle = up ? COLORS.volUp : COLORS.volDown;
      ctx.fillRect(x - bodyW / 2, volB - barH, bodyW, barH);
    }

    // Labels
    ctx.fillStyle = COLORS.text;
    ctx.font = "10px system-ui,sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label || "", chartL, 12);
    ctx.textAlign = "right";
    ctx.fillText(`POC $${vp.poc.toFixed(2)}`, W - padR, 12);
    ctx.fillText("Vol", chartL, volT + 10);
    ctx.textAlign = "right";
    ctx.fillText("VPVR", vpR, volB);
    ctx.textAlign = "left";
    ctx.fillText(`$${last.toFixed(2)}`, chartL, H - 4);
  }

  function miniPlotHtml(id) {
    return `<div class="mini-plot" data-plot-id="${id}">
      <canvas class="mini-plot-canvas" aria-label="${TICKER_LABELS[id]} price, volume, and VPVR"></canvas>
      <div class="mini-plot-foot">
        <span class="mini-plot-sym">${TICKER_LABELS[id]}</span>
        <span class="mini-plot-meta" data-plot-meta="${id}">loading…</span>
      </div>
    </div>`;
  }

  async function mount(activeId) {
    const el = document.getElementById("mini-plot-active");
    if (!el) return;
    el.innerHTML = miniPlotHtml(activeId);
    const wrap = el.querySelector(`[data-plot-id="${activeId}"]`);
    const canvas = wrap?.querySelector("canvas");
    const meta = wrap?.querySelector(`[data-plot-meta="${activeId}"]`);
    if (!canvas) return;

    try {
      const data = await loadBars(activeId);
      const bars = data.bars;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      draw(canvas, bars, `${data.symbol} · 6mo daily`);
      if (meta && bars.length) {
        const vp2 = computeVPVR(bars, 28);
        const chg = ((bars.at(-1).c - bars[0].c) / bars[0].c) * 100;
        const sign = chg >= 0 ? "+" : "";
        meta.textContent = `${sign}${chg.toFixed(1)}% · VA $${vp2.val.toFixed(2)}–$${vp2.vah.toFixed(2)}`;
      }
    } catch {
      draw(canvas, [], activeId);
      if (meta) meta.textContent = "market data unavailable";
    }
  }

  let resizeTimer;
  let lastId = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (lastId) mount(lastId);
    }, 150);
  });

  function drawSparkline(canvas, bars, opts) {
    const o = opts || {};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(canvas.clientWidth || canvas.parentElement?.clientWidth || 0, 60);
    const H = canvas.clientHeight || 32;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!bars || !bars.length) return;
    let minP = Infinity;
    let maxP = -Infinity;
    for (const b of bars) {
      if (b.l < minP) minP = b.l;
      if (b.h > maxP) maxP = b.h;
    }
    if (maxP === minP) maxP = minP + 1;
    const pad = 2;
    const w = W - pad * 2;
    const h = H - pad * 2;
    const n = bars.length;
    const xs = (i) => pad + (i / Math.max(1, n - 1)) * w;
    const ys = (p) => pad + h - ((p - minP) / (maxP - minP)) * h;
    const first = bars[0].c;
    const last = bars[n - 1].c;
    const up = last >= first;
    const color = o.color || (up ? "#3dd68c" : "#f87171");
    const fill = o.fill || (up ? "rgba(61,214,140,0.16)" : "rgba(248,113,113,0.16)");

    ctx.beginPath();
    ctx.moveTo(xs(0), ys(bars[0].c));
    for (let i = 1; i < n; i++) ctx.lineTo(xs(i), ys(bars[i].c));
    ctx.lineTo(xs(n - 1), pad + h);
    ctx.lineTo(xs(0), pad + h);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xs(0), ys(bars[0].c));
    for (let i = 1; i < n; i++) ctx.lineTo(xs(i), ys(bars[i].c));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xs(n - 1), ys(last), 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return {
    mount(activeId) {
      lastId = activeId;
      return mount(activeId);
    },
    loadBars,
    computeVPVR,
    drawSparkline,
  };
})();
