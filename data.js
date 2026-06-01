/* eslint-disable no-unused-vars */
const THESES = {
  ibm: {
    id: "ibm",
    ticker: "IBM US EQ",
    title: "IBM: The AI Infrastructure Compounder",
    meta: "International Business Machines · NYSE · Godel Terminal (DES/FA/EM), 2026-06-01",
    price: 316.49,
    stats: [
      { v: "$316.49", l: "Last price" },
      { v: "$297.46B", l: "Market cap" },
      { v: "$338.0B", l: "Enterprise value" },
      { v: "+7.6%", l: "FY25 revenue YoY", tone: "success" },
    ],
    lead:
      'A 114-year-old franchise re-rated as an <strong>enterprise AI infrastructure</strong> play. FY25 revenue <strong>$67.5B (+7.6% YoY)</strong> with operating margin <strong>18.2%</strong>. <strong>2.3% dividend</strong>, beta 0.58, consensus EPS growth ~8%.',
    pillars: [
      { title: "1 · Mainframe = AI capacity", tag: "z17 cycle", tagTone: "success", body: "z17 refresh and on-prem AI inference turn mainframe into capacity bottleneck. FY25 revenue <strong>+7.6%</strong> after Kyndryl spin flat years." },
      { title: "2 · Software + hybrid cloud mix", tag: "watsonx", tagTone: "info", body: "Red Hat and watsonx as neutral enterprise AI stack. Gross margin ~<strong>56%</strong>, op margin <strong>18.2%</strong>." },
      { title: "3 · Dividend fortress", tag: "2.3% yield", tagTone: "success", body: "Forward yield <strong>2.26%</strong>, payout ~59%, beta <strong>0.58</strong>. Institutions 66% — core holding bought on dips." },
      { title: "4 · Earnings re-accelerating", tag: "EPS +74%", tagTone: "info", body: "GAAP EPS <strong>6.43 → 11.17 → 12.44 → 13.42</strong> (2024–27E). FY25 EPS <strong>+74%</strong> YoY. Forward P/E <strong>22.2x</strong> FY27E." },
    ],
    revenueYears: ["FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25"],
    revenue: [79.92, 79.14, 79.59, 57.71, 55.18, 57.35, 60.53, 61.86, 62.75, 67.53],
    opMargin: [16.2, 15.2, 15.2, 13.1, 8.4, 12.0, 13.5, 16.6, 12.0, 18.2],
    netMargin: [14.9, 7.3, 11.0, 16.3, 10.1, 10.0, 2.7, 12.1, 9.6, 15.7],
    epsYears: ["2024", "2025", "2026E", "2027E", "2028E"],
    eps: [6.43, 11.17, 12.44, 13.42, 14.86],
    fwdPeLabels: ["Trailing", "Next 4Q", "FY26E", "FY27E"],
    fwdPe: [26.3, 23.6, 23.9, 22.2],
    scenarios: [
      { name: "Bear", prob: 0.25, eps: 11.5, exitPe: 18, tone: "danger", thesis: "Mainframe / AI cycle fades, hybrid-cloud stalls, payout strains FCF; multiple compresses." },
      { name: "Base", prob: 0.5, eps: 13.4, exitPe: 23, tone: "info", thesis: "Consensus EPS path: software + consulting mid-single-digits, z17 sustains, Watsonx gradual." },
      { name: "Bull", prob: 0.25, eps: 15.0, exitPe: 28, tone: "success", thesis: "AI supercycle: Granite/watsonx, OpenShift AI wins, mainframe shortages; margin >19% op." },
    ],
    valNote: "Target = FY27 consensus EPS × exit P/E. ~22x forward with ~8% EPS CAGR — fair for low-beta dividend compounder with AI option.",
    catalysts: ["z17 capacity shortages drive backlog and pricing.", "watsonx / Granite enterprise AI pilots → ARR.", "Red Hat OpenShift AI in regulated industries.", "Dividend growth attracts income mandates."],
    risks: ["Mainframe cycle finite — FY26-27 may mark peak spend.", "Hyperscaler AI bypasses IBM middleware.", "Stock +6% on AI narrative — crowded re-rate.", "FX / consulting margin if IT budgets tighten."],
    verdict: "<strong>Hold core; add on 8–10% pullbacks.</strong> Rare mega-cap: <strong>2.3% dividend</strong>, <strong>0.58 beta</strong>, credible AI infrastructure. Fair at current price — don't chase gap-ups.",
    zones: [
      { text: "Strong buy < $275", tone: "success" },
      { text: "Accumulate $275–300", tone: "info" },
      { text: "Hold core; trim > $360", tone: "warning" },
    ],
    footnote: "Wedbush Outperform, PT $320 (Godel ANR). Scenario EPS/exit multiples are author assumptions.",
  },
  now: {
    id: "now",
    ticker: "NOW US EQ",
    title: "ServiceNow: The Workflow Operating System",
    meta: "ServiceNow, Inc. · NYSE · Godel Terminal (DES/FA/EM), 2026-06-01",
    price: 133.8,
    stats: [
      { v: "$133.80", l: "Last price" },
      { v: "$137.99B", l: "Market cap" },
      { v: "$125.5B", l: "Enterprise value" },
      { v: "35%", l: "Rule of 40 (FY25)", tone: "warning" },
    ],
    lead:
      '<strong>Compounder at a grown-up multiple.</strong> $13.3B revenue <strong>+20.9% YoY</strong>, <strong>77.5% gross margin</strong>, <strong>$5.4B OCF</strong>. Bet: workflow stays mission-critical, Now Assist expands wallet share — if growth stays above ~18%.',
    pillars: [
      { title: "1 · Revenue engine still firing", tag: "Compounder", tagTone: "success", body: "FY25 <strong>$13.28B (+20.9% YoY)</strong>. Op margin <strong>13.7%</strong> from 12.4% FY24." },
      { title: "2 · Deferred revenue = visibility", tag: "$8.3B RPO", tagTone: "info", body: "Deferred revenue <strong>$8.31B</strong>. OCF <strong>$5.44B</strong>; capex $868M; ~3.3% FCF yield." },
      { title: "3 · Best-in-class unit economics", tag: "77.5% GM", tagTone: "success", body: "Gross margin <strong>77.5%</strong>, zero inventory. R&D 22%; SG&A <strong>8.5%</strong>. Room to mid-teens op margin." },
      { title: "4 · AI is catalyst, not threat (yet)", tag: "AI option", tagTone: "info", body: "FY27 EPS <strong>$5.03 (+21.9%)</strong> embeds Now Assist. 88% institutional ownership. Risk is narrative rotation." },
    ],
    revenueYears: ["FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25"],
    revenue: [1.391, 1.918, 2.609, 3.46, 4.519, 5.896, 7.245, 8.971, 10.984, 13.278],
    opMargin: [-27.5, -3.4, -1.6, 1.2, 4.4, 4.4, 4.9, 8.5, 12.4, 13.7],
    netMargin: [-29.8, -6.1, -1.0, 18.1, 2.6, 3.9, 4.5, 19.3, 13.0, 13.2],
    epsYears: ["2024", "2025", "2026E", "2027E", "2028E"],
    eps: [1.37, 1.67, 4.12, 5.03, 6.08],
    fwdPeLabels: ["Trailing", "Next 4Q", "FY26E", "FY27E"],
    fwdPe: [74.0, 28.5, 30.0, 24.6],
    scenarios: [
      { name: "Bear", prob: 0.25, eps: 4.2, exitPe: 20, tone: "danger", thesis: "Growth low-teens, AI commoditizes moat, federal IT tightens; mature-SaaS multiple." },
      { name: "Base", prob: 0.5, eps: 5.05, exitPe: 27, tone: "info", thesis: "~21% revenue growth, op margin mid-teens, Now Assist contributes without re-acceleration." },
      { name: "Bull", prob: 0.25, eps: 6.1, exitPe: 32, tone: "success", thesis: "AI platform drives pricing; Rule of 40 sustained; federal/GenAI deals pull RPO forward." },
    ],
    valNote: "Target = FY27 EPS × exit P/E. ~24.7x forward FY26 — reasonable for 20%+ grower with 77% GM and $6B+ liquidity.",
    catalysts: ["Now Assist / GenAI ACV uplift on 20K+ customers.", "Op margin >15% unlocks Rule-of-40 >40.", "Federal / regulated deal wins.", "$6.3B cash funds buybacks and tuck-ins."],
    risks: ["Growth <18% — multiple de-rates fast.", "Trailing P/E 74x — GAAP miss hits sentiment.", "Short interest 57.9M shares (2.37 days).", "Copilot bundling vs system-of-record moat."],
    verdict: "<strong>Core long — add on weakness, do not chase.</strong> ~25x forward for ~21% EPS growth and <strong>$6.3B</strong> liquidity. Fair, not cheap — buying duration.",
    zones: [
      { text: "Strong buy < $105", tone: "success" },
      { text: "Accumulate $105–120", tone: "info" },
      { text: "Hold core; trim > $165", tone: "warning" },
    ],
    footnote: "BofA Buy / Barclays Overweight per Godel ANR. 3–5 year hold sizing.",
  },
  nok: {
    id: "nok",
    ticker: "NOK US EQ",
    title: "Nokia: The Margin-Recovery Re-Rate",
    meta: "Nokia Oyj · ADR · NYSE · Godel Terminal (DES/FA/EM), 2026-06-01",
    price: 14.92,
    stats: [
      { v: "$14.92", l: "Last price" },
      { v: "$83.44B", l: "Market cap" },
      { v: "$93.9B", l: "Enterprise value" },
      { v: "+17.3%", l: "FY25 revenue YoY", tone: "success" },
    ],
    lead:
      'Earnings troughed 2025 at <strong>$0.13</strong>, inflect <strong>~+200%</strong> in 2026. Revenue <strong>+17.3% YoY</strong>. Bet: <strong>operating leverage on network refresh</strong>, net-cash balance sheet pays you to wait.',
    pillars: [
      { title: "1 · Earnings have turned", tag: "Inflection", tagTone: "success", body: "GAAP EPS <strong>0.25 → 0.13 → 0.39 → 0.46</strong> (2024–27E). 2025 trough margin-driven; revenue <strong>grew 17%</strong>." },
      { title: "2 · Margin headroom is real", tag: "Mix", tagTone: "info", body: "Op margin <strong>10.2% FY24</strong> → <strong>4.4% FY25</strong>. Revert to FY24 on flat revenue ~<strong>doubles</strong> operating income." },
      { title: "3 · Balance sheet pays you to wait", tag: "Net cash", tagTone: "success", body: "~<strong>$7.5B liquidity</strong> vs ~<strong>$4.4B debt</strong>. FY25 FCF ~<strong>$1.7B</strong>. Buyback + 1.27% fwd yield." },
      { title: "4 · Asymmetry with defense", tag: "Beta 0.77", tagTone: "info", body: "Low beta + net cash + AI connectivity (CEO Hotard). Optical / DC-interconnect option without balance-sheet risk." },
    ],
    revenueYears: ["FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25"],
    revenue: [24.87, 27.81, 25.82, 26.17, 26.69, 25.13, 26.65, 23.38, 19.89, 23.34],
    opMargin: [-5.1, 0.0, 0.3, 2.1, 4.0, 9.7, 9.3, 7.9, 10.2, 4.4],
    netMargin: [-3.9, -6.3, 1.5, 0.0, -11.5, 7.4, 17.1, 3.2, 6.7, 3.3],
    epsYears: ["2024", "2025", "2026E", "2027E"],
    eps: [0.25, 0.13, 0.39, 0.46],
    fwdPeLabels: ["Trailing", "Next 4Q", "FY26E", "FY27E"],
    fwdPe: [87.3, 37.1, 38.0, 32.3],
    scenarios: [
      { name: "Bear", prob: 0.25, eps: 0.3, exitPe: 16, tone: "danger", thesis: "Margin stalls 4–5%, AI capex routes around Nokia, Huawei/Ericsson pricing pressure." },
      { name: "Base", prob: 0.5, eps: 0.47, exitPe: 26, tone: "info", thesis: "Low-single-digit revenue, op margin toward 8%, dividend held, modest buyback." },
      { name: "Bull", prob: 0.25, eps: 0.62, exitPe: 32, tone: "success", thesis: "AI networking supercycle: optical demand, op margin 11%+, beat-and-raise re-rate." },
    ],
    valNote: "Target = FY27 EPS × exit P/E. On trailing P/E 87x nothing is cheap — call rests on inflection landing.",
    catalysts: ["Q2/Q3 2026 op-margin recovery >8%.", "AI DC interconnect / optical design wins.", "Buyback expansion on net-cash + $1.7B FCF.", "Nokia Technologies patent settlements."],
    risks: ["Trailing P/E 87x, EV/EBITDA 31.8x — miss de-rates hard.", "Payout ~99.8% — no dividend cushion.", "Telco capex cyclical / lumpy.", "Ericsson/Huawei pricing compresses margin."],
    verdict: "<strong>Accumulate on weakness — conviction with discipline.</strong> Inflection genuine, balance sheet removes left tail. Edge is entry at <strong>$14.92</strong>.",
    zones: [
      { text: "Back up the truck < $11.50", tone: "success" },
      { text: "Build $11.50–13.00", tone: "info" },
      { text: "Hold / trim > $18", tone: "warning" },
    ],
    footnote: "Below $12: ~3:1 reward-to-risk to bull vs bear. Starter position on telco-capex fear.",
  },
};

const TICKER_ORDER = ["ibm", "now", "nok"];
const TICKER_LABELS = { ibm: "IBM", now: "NOW", nok: "NOK" };
const YAHOO_SYMBOL = { ibm: "IBM", now: "NOW", nok: "NOK" };

function pt(s) {
  return s.eps * s.exitPe;
}
function fmtPct(n) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;
}
function weightedPT(t) {
  return t.scenarios.reduce((a, s) => a + s.prob * pt(s), 0);
}
function upside(price, target) {
  return ((target - price) / price) * 100;
}
