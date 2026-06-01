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
  intc: {
    id: "intc",
    ticker: "INTC US EQ",
    title: "Intel: The IDM 2.0 Foundry Turnaround",
    meta: "Intel Corporation · NASDAQ · SEC filings & consensus, 2026-06-01",
    price: 114.68,
    stats: [
      { v: "$114.68", l: "Last price" },
      { v: "~$494B", l: "Market cap" },
      { v: "Flat", l: "FY25 revenue YoY", tone: "warning" },
      { v: "+22%", l: "DCAI Q1 FY26 YoY", tone: "success" },
    ],
    lead:
      '<strong>Turnaround in motion — multiple already re-rated.</strong> FY25 revenue <strong>$52.9B (flat)</strong>, GAAP op margin improving to <strong>(4.2%)</strong> from <strong>(22%)</strong> FY24; non-GAAP EPS <strong>$0.42</strong>. Bet: <strong>18A foundry + server CPU</strong> share stabilize while CHIPS Act funds the fab build-out — but at <strong>~$115</strong> the market prices a lot of success upfront.',
    pillars: [
      { title: "1 · Foundry = the swing factor", tag: "18A / IFS", tagTone: "info", body: "IDM 2.0 makes manufacturing the margin engine. Microsoft, NVIDIA, and others on the IFS roadmap — but Q1 FY26 foundry still lost <strong>~$2.4B</strong> op. Success = external wafers at scale." },
      { title: "2 · DCAI re-accelerating", tag: "+22% YoY", tagTone: "success", body: "Data Center & AI revenue <strong>+22% YoY</strong> in Q1 FY26. CPU-to-GPU ratios in AI clusters may lift server CPU attach — offsets share loss vs AMD in some workloads." },
      { title: "3 · Cost base reset", tag: "R&D −17%", tagTone: "success", body: "FY25 R&D + MG&A <strong>$18.4B (−17% YoY)</strong>. Gross margin <strong>36.7%</strong> non-GAAP vs trough. $9.7B OCF FY25 funds capex with CHIPS subsidies." },
      { title: "4 · Valuation ≠ deep value anymore", tag: "Post 6x rally", tagTone: "warning", body: "Stock up sharply off 2024 lows; FY27 consensus EPS <strong>~$0.99</strong> implies <strong>~115x</strong> at spot. You are paying for foundry proof and sustained DCAI — not a cigar butt." },
    ],
    revenueYears: ["FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25"],
    revenue: [59.39, 62.76, 70.85, 71.97, 77.87, 79.02, 63.05, 54.23, 53.1, 52.85],
    opMargin: [22.0, 27.9, 32.4, 31.6, 31.5, 29.8, 13.8, 0.7, -22.0, -4.2],
    netMargin: [17.8, 26.1, 29.2, 27.6, 24.6, 21.6, 11.5, 2.7, -35.3, -0.6],
    epsYears: ["2024", "2025", "2026E", "2027E", "2028E"],
    eps: [-4.38, -0.06, 0.49, 0.99, 1.35],
    fwdPeLabels: ["Trailing", "Next 4Q", "FY26E", "FY27E"],
    fwdPe: [0, 85.0, 234.0, 116.0],
    scenarios: [
      { name: "Bear", prob: 0.3, eps: 0.55, exitPe: 40, tone: "danger", thesis: "18A slips, IFS losses persist, AMD/NVIDIA take DC share; multiple compresses to “ex-growth semi.”" },
      { name: "Base", prob: 0.45, eps: 0.95, exitPe: 58, tone: "info", thesis: "Revenue ~$51–54B, non-GAAP margin mid-single-digits, foundry losses narrow; EPS tracks consensus." },
      { name: "Bull", prob: 0.25, eps: 1.35, exitPe: 72, tone: "success", thesis: "IFS wins high-volume external customers, DCAI sustains 20%+ growth, op margin high-single-digits by FY28." },
    ],
    valNote: "Target = FY27 EPS × exit P/E. After a multi-quarter re-rate, weighted PT sits <strong>well below</strong> spot — edge is sizing and entry, not chasing momentum.",
    catalysts: ["18A customer ramps and IFS revenue recognition.", "DCAI beat-and-raise on AI server CPU attach.", "CHIPS Act milestone payments / cost sharing.", "Non-GAAP op margin positive full-year FY26."],
    risks: ["Foundry segment multi-billion quarterly losses until external volume.", "AMD DC revenue overtook Intel Q1 FY26 — share pressure.", "Capex / depreciation overhang if utilizations lag.", "Stock priced for turnaround success — guide-down hits hard."],
    verdict: "<strong>Hold / trim momentum; add only on deep pullbacks.</strong> Fundamental story improved; <strong>risk/reward at ~$115 favors patience</strong>, not new full-size chasing. Sized bet on IDM 2.0, not a value trap.",
    zones: [
      { text: "Back up truck < $75", tone: "success" },
      { text: "Starter $75–95", tone: "info" },
      { text: "Hold core; trim > $125", tone: "warning" },
    ],
    footnote: "FY25 from Intel Q4 FY25 release. Q1 FY26 DCAI +22% YoY per earnings coverage. Scenario EPS/exit multiples are author assumptions — not investment advice.",
  },
};

const TICKER_ORDER = ["ibm", "now", "nok", "intc"];
const TICKER_LABELS = { ibm: "IBM", now: "NOW", nok: "NOK", intc: "INTC" };
const YAHOO_SYMBOL = { ibm: "IBM", now: "NOW", nok: "NOK", intc: "INTC" };

const TICKER_META = {
  ibm:  { id: "ibm",  symbol: "IBM",  name: "International Business Machines", exchange: "NYSE",   sector: "Technology — IT Services",      hasThesis: true },
  now:  { id: "now",  symbol: "NOW",  name: "ServiceNow, Inc.",                exchange: "NYSE",   sector: "Technology — Application SW",   hasThesis: true },
  nok:  { id: "nok",  symbol: "NOK",  name: "Nokia Oyj (ADR)",                 exchange: "NYSE",   sector: "Comms Equipment",               hasThesis: true },
  intc: { id: "intc", symbol: "INTC", name: "Intel Corporation",               exchange: "NASDAQ", sector: "Semiconductors",                hasThesis: true },
};

const DEFAULT_WATCHLIST = ["ibm", "now", "nok", "intc"];

// ============================================================
//   IPO PLAY — recent & upcoming listings (Godel Terminal IPO/DES, 2026-06-01)
//   Categories are the high-level filter layer; each record carries a deep
//   "legendary" dive (debut mechanics, pillars, filings timeline, risk flags).
// ============================================================
const IPO_CATEGORIES = [
  "AI Infra",
  "AI Power / Energy",
  "Nuclear",
  "Quantum",
  "Defense / Space",
  "Critical Materials",
];

const IPOS = [
  {
    id: "qnt", ticker: "QNT", name: "Quantinuum", status: "upcoming",
    categories: ["Quantum", "AI Infra"],
    exchange: "NASDAQ", ipoDate: "2026-06-04",
    offerSize: "$1.2B", priceRange: "$53–55", ipoPrice: null, sharesOffered: "21.1M",
    openPrice: null, closePrice: null, lastPrice: null,
    note: "Most “you-coded” upcoming IPO — but likely crowded as hell. Watch first trading behavior, don’t blind-ape.",
    lead:
      'The headline quantum IPO. Honeywell-backed Quantinuum is <strong>upsizing</strong> its NASDAQ debut to raise <strong>~$1.46B</strong> at an expected <strong>$53–55</strong>/share, with press reports floating a valuation up to <strong>~$12.7B</strong>. Pure-play quantum at venture-scale pricing.',
    pillars: [
      { title: "1 · Real hardware, real backer", tag: "Honeywell", tagTone: "success", body: "Trapped-ion systems with Honeywell as anchor — the most institutionally-credible name in the quantum cohort. Not a SPAC shell." },
      { title: "2 · Upsized into demand", tag: "$1.46B raise", tagTone: "info", body: "Deal <strong>upsized</strong> ahead of pricing per Reuters/SEC filing — books are covered. 21.1M shares, $1.2B+ base offer." },
      { title: "3 · The “coded” narrative", tag: "Quantum + AI", tagTone: "info", body: "Sits at the quantum-compute / AI-infrastructure intersection — the most thematically-loaded story in the group." },
    ],
    filings: [
      { date: "2026-06-01", type: "Reuters", desc: "IPO price per share expected between $53 and $55 (SEC filing)." },
      { date: "2026-06-01", type: "Reuters", desc: "Honeywell-backed Quantinuum aims to raise $1.46B in upsized US IPO." },
      { date: "2026-06-04", type: "Expected pricing", desc: "NASDAQ debut, 21.1M shares." },
    ],
    riskFlags: [
      "Crowded trade — quantum mania means the float can gap and fade hard.",
      "Pre-revenue economics: valuation rests on narrative, not cash flow.",
      "First-day price discovery is violent for hyped names — let it print before sizing.",
    ],
    verdict:
      "<strong>Watch the first trading session, do not blind-ape the open.</strong> Most credible quantum name with a real backer, but the hype tax is real. Let price discovery settle.",
    howToPlay: [
      { text: "Watch open, no chase", tone: "warning" },
      { text: "Starter only after first fade", tone: "info" },
    ],
  },
  {
    id: "cbrs", ticker: "CBRS", name: "Cerebras Systems", status: "priced",
    categories: ["AI Infra"],
    exchange: "NASDAQ", ipoDate: "2026-05-14",
    offerSize: "$5.5B", priceRange: null, ipoPrice: 185.00, sharesOffered: "30.0M",
    openPrice: 350.00, closePrice: 311.07, lastPrice: 233.40,
    note: "Already ripped — IPO $185, open $350, close $311. Core AI-infra watch, but not cheap. Demand was >20x supply.",
    lead:
      'The blowout AI-chip debut. Priced at <strong>$185</strong>, opened at <strong>$350</strong> (+89%), closed <strong>$311.07</strong>. Reuters pegged IPO demand at <strong>&gt;20x supply</strong>. Since then it has cooled to <strong>~$233</strong> — still a core AI-infrastructure watch, just no longer cheap.',
    pillars: [
      { title: "1 · Wafer-scale AI compute", tag: "Anti-NVDA", tagTone: "success", body: "Cerebras’ wafer-scale engine is the highest-profile non-NVIDIA AI-training story to list. Pure AI-infra exposure." },
      { title: "2 · Demand >20x supply", tag: "Hot book", tagTone: "info", body: "Reuters: IPO oversubscribed more than 20x. Opened nearly <strong>+90%</strong> over offer — institutional appetite was extreme." },
      { title: "3 · Now in price discovery", tag: "Fading", tagTone: "warning", body: "From a $350 open to ~$233 — the froth is coming out. This is where the real entry conversation starts." },
    ],
    filings: [
      { date: "2026-05-14", type: "424B4", desc: "Priced 30.0M shares at $185.00 (NASDAQ)." },
      { date: "2026-05-14", type: "Debut", desc: "Opened $350.00, closed $311.07 on 33.5M shares." },
      { date: "post-IPO", type: "Form 4 cluster", desc: "Insider/early-holder activity typical after a hot listing — check CF." },
    ],
    riskFlags: [
      "Down ~25% from the $311 close — momentum has rolled over.",
      "Customer concentration and AI-capex cyclicality.",
      "Opened +89% over offer — anyone who chased the open is deep underwater.",
    ],
    verdict:
      "<strong>Core AI-infra watch — accumulate on the fade, never chase the pop.</strong> The franchise is real; the entry matters more than the story here.",
    howToPlay: [
      { text: "Watch < $200", tone: "success" },
      { text: "Don’t chase > $300", tone: "danger" },
    ],
  },
  {
    id: "frvo", ticker: "FRVO", name: "Fervo Energy", status: "priced",
    categories: ["AI Power / Energy"],
    exchange: "NASDAQ", ipoDate: "2026-05-13",
    offerSize: "$1.9B", priceRange: null, ipoPrice: 27.00, sharesOffered: "70.0M",
    openPrice: 36.00, closePrice: 36.54, lastPrice: 36.64,
    note: "Strongest “AI needs electricity” narrative. IPO $27, close $36.54. Surged on debut with major contract/backlog angle.",
    lead:
      'The cleanest <strong>“AI needs electricity”</strong> play in the group. Enhanced geothermal developer Fervo priced at <strong>$27</strong>, surged to a <strong>$36</strong> open and held it (<strong>$36.54</strong> close, ~$36.6 now). Reuters tied the pop to a contract/backlog story powering data centers.',
    pillars: [
      { title: "1 · Geothermal for data centers", tag: "Baseload", tagTone: "success", body: "Enhanced geothermal = 24/7 carbon-free baseload — exactly what AI data centers need. The narrative writes itself." },
      { title: "2 · Held the debut pop", tag: "+35% & stuck", tagTone: "success", body: "Unlike many hot listings, FRVO held its gains: $27 → $36 open → $36.54 close → ~$36.6 now. Demand is sticky." },
      { title: "3 · Backlog is the catalyst", tag: "Contracts", tagTone: "info", body: "Reuters flagged a major contract/backlog angle — the bridge from narrative to revenue visibility." },
    ],
    filings: [
      { date: "2026-05-13", type: "424B4", desc: "Priced 70.0M shares at $27.00 (NASDAQ)." },
      { date: "2026-05-13", type: "Debut", desc: "Opened $36.00, closed $36.54 on 35.2M shares." },
    ],
    riskFlags: [
      "Capital-intensive project developer — execution and financing risk on backlog.",
      "Trading ~35% above offer; entry is no longer at the IPO discount.",
      "Geothermal scale-up timelines are long and lumpy.",
    ],
    verdict:
      "<strong>Best-of-breed AI-power thesis — accumulate, the debut gains stuck.</strong> The one debut that held; treat pullbacks toward the offer band as gifts.",
    howToPlay: [
      { text: "Accumulate near $30", tone: "success" },
      { text: "Core AI-power hold", tone: "info" },
    ],
  },
  {
    id: "xe", ticker: "XE", name: "X-energy", status: "priced",
    categories: ["Nuclear", "AI Power / Energy"],
    exchange: "NASDAQ", ipoDate: "2026-04-24",
    offerSize: "$1.0B", priceRange: null, ipoPrice: 23.00, sharesOffered: "44.3M",
    openPrice: 30.11, closePrice: 29.20, lastPrice: 27.05,
    note: "Very aligned with the nuclear/AI-grid thesis. IPO $23, close $29.20. Shares rose ~31% on debut tied to AI electricity demand.",
    lead:
      'Direct exposure to the <strong>nuclear + AI-grid</strong> thesis. SMR developer X-energy priced at <strong>$23</strong>, rose <strong>~31%</strong> on debut (open $30.11, close $29.20), and has eased to <strong>~$27</strong>. Reuters tied demand explicitly to AI electricity needs.',
    pillars: [
      { title: "1 · SMRs for the AI grid", tag: "Nuclear", tagTone: "success", body: "Small modular reactors are the institutional answer to AI’s power crunch. X-energy is a leading pure-play listing." },
      { title: "2 · Clean debut, orderly fade", tag: "+31% debut", tagTone: "info", body: "$23 → $30.11 open → $29.20 close, now ~$27. A measured fade, not a blow-off — healthier base-building." },
      { title: "3 · Policy + power tailwind", tag: "AI demand", tagTone: "info", body: "Reuters framed the pop around AI electricity demand — the same secular driver behind FRVO and the nuclear cohort." },
    ],
    filings: [
      { date: "2026-04-24", type: "424B4", desc: "Priced 44.3M shares at $23.00 (NASDAQ)." },
      { date: "2026-04-24", type: "Debut", desc: "Opened $30.11, closed $29.20 on 44.4M shares." },
    ],
    riskFlags: [
      "SMR commercialization is multi-year — revenue is largely a future option.",
      "Drifting below the close ($29.20 → ~$27) as debut enthusiasm cools.",
      "Regulatory/licensing timelines and capital intensity.",
    ],
    verdict:
      "<strong>Core nuclear/AI-power watch — build the position on the fade toward offer.</strong> Cleanest listed SMR bet on the AI-electricity theme; patient accumulation beats chasing.",
    howToPlay: [
      { text: "Build $23–25", tone: "success" },
      { text: "Add on grid/AI headlines", tone: "info" },
    ],
  },
  {
    id: "aadx", ticker: "AADX", name: "Applied Aerospace & Defense", status: "upcoming",
    categories: ["Defense / Space"],
    exchange: "NYSE", ipoDate: "2026-06-03",
    offerSize: "$784.9M", priceRange: null, ipoPrice: null, sharesOffered: "32.5M",
    openPrice: null, closePrice: null, lastPrice: null,
    note: "Upcoming/near-term defense IPO. Makes fuselages, flight-control surfaces, rocket-motor cases — riding defense-sector appetite.",
    lead:
      'A near-term <strong>defense-components</strong> listing. Reuters describes Applied Aerospace & Defense as a maker of <strong>fuselages, flight-control surfaces and rocket-motor cases</strong>, listing into strong defense-sector appetite. NYSE debut, ~$785M offer across 32.5M shares.',
    pillars: [
      { title: "1 · Picks-and-shovels defense", tag: "Components", tagTone: "success", body: "Structural and propulsion components (fuselages, control surfaces, rocket-motor cases) — supplier to the whole defense buildout, not one program." },
      { title: "2 · Sector appetite is hot", tag: "Defense bid", tagTone: "info", body: "Reuters frames the deal as riding elevated defense-sector demand and geopolitical spending." },
      { title: "3 · Real hardware, real revenue", tag: "Industrial", tagTone: "info", body: "Unlike the story stocks, this is a hard-goods industrial supplier — cash-flow profile should anchor the valuation." },
    ],
    filings: [
      { date: "2026-06-03", type: "Expected pricing", desc: "NYSE debut, 32.5M shares, ~$784.9M offer." },
      { date: "pre-IPO", type: "S-1 / SECF", desc: "Check CF / SECF for prospectus detail as pricing approaches." },
    ],
    riskFlags: [
      "Pricing terms (offer price) not yet set — mechanics still forming.",
      "Defense-budget and program-timing cyclicality.",
      "Components suppliers carry customer-concentration risk.",
    ],
    verdict:
      "<strong>Cleanest hard-asset defense play in the queue — track the pricing.</strong> Industrial supplier with real revenue; let the offer price set before judging entry.",
    howToPlay: [
      { text: "Wait for pricing", tone: "warning" },
      { text: "Defense-bid watch", tone: "info" },
    ],
  },
  {
    id: "hawk", ticker: "HAWK", name: "HawkEye 360", status: "priced",
    categories: ["Defense / Space"],
    exchange: "NYSE", ipoDate: "2026-05-07",
    offerSize: "$416.0M", priceRange: null, ipoPrice: 26.00, sharesOffered: "16.0M",
    openPrice: 33.80, closePrice: 34.00, lastPrice: 33.21,
    note: "Clean defense-space data play. IPO $26, close $34. Revenue jumped 74% in 2025 and it swung profitable.",
    lead:
      'A <strong>defense-space data</strong> play with actual fundamentals. RF/signal-intelligence satellite operator HawkEye 360 priced at <strong>$26</strong>, opened $33.80 and closed <strong>$34</strong>, holding ~$33 since. Reuters: revenue <strong>+74% in 2025</strong> and the company <strong>swung profitable</strong>.',
    pillars: [
      { title: "1 · Space-based RF intelligence", tag: "SIGINT", tagTone: "success", body: "Commercial radio-frequency / signal-intelligence from orbit — a scarce, defensible defense-space data asset." },
      { title: "2 · Fundamentals, not just story", tag: "+74% rev", tagTone: "success", body: "Reuters: 2025 revenue <strong>+74%</strong> and swung to profitability — rare among this IPO cohort." },
      { title: "3 · Held the debut", tag: "Sticky", tagTone: "info", body: "$26 → $34 close → ~$33 now. Gains held, suggesting demand backed by numbers rather than pure hype." },
    ],
    filings: [
      { date: "2026-05-07", type: "424B4", desc: "Priced 16.0M shares at $26.00 (NYSE)." },
      { date: "2026-05-07", type: "Debut", desc: "Opened $33.80, closed $34.00 on 11.4M shares." },
    ],
    riskFlags: [
      "Trading ~30% above offer — entry is post-pop.",
      "Government/defense contract concentration.",
      "Satellite capex and constellation-refresh cost.",
    ],
    verdict:
      "<strong>Highest-quality defense-space debut — accumulate on weakness.</strong> The one with real revenue growth and profitability; treat dips toward the high-$20s as the opportunity.",
    howToPlay: [
      { text: "Accumulate < $30", tone: "success" },
      { text: "Core defense-space hold", tone: "info" },
    ],
  },
  {
    id: "avex", ticker: "AVEX", name: "AEVEX Aerospace", status: "priced",
    categories: ["Defense / Space"],
    exchange: "NYSE", ipoDate: "2026-04-17",
    offerSize: "$320.0M", priceRange: null, ipoPrice: 20.00, sharesOffered: "16.0M",
    openPrice: 23.01, closePrice: 26.93, lastPrice: 26.93,
    note: "Good war-tech theme. IPO $20, close $26.93. Framed as drone/defense demand driven by modern warfare and geopolitical spending.",
    lead:
      'A <strong>drone / war-tech</strong> defense debut that kept climbing intraday. AEVEX priced at <strong>$20</strong>, opened $23.01 and <strong>closed up at $26.93</strong> (+35% on the day). Reuters frames it around drone/defense demand from modern warfare and geopolitical spending.',
    pillars: [
      { title: "1 · Drone & autonomy defense", tag: "War-tech", tagTone: "success", body: "Unmanned systems and full-spectrum airborne ISR — squarely on the modern-warfare spending theme." },
      { title: "2 · Closed above the open", tag: "Strength", tagTone: "success", body: "$20 → $23.01 open → $26.93 close: buyers pressed into the close, the opposite of a fade. Strong tape." },
      { title: "3 · Geopolitics is the tailwind", tag: "Spend cycle", tagTone: "info", body: "Reuters ties demand to drone/defense spending — a multi-year procurement cycle, not a one-off." },
    ],
    filings: [
      { date: "2026-04-17", type: "424B4", desc: "Priced 16.0M shares at $20.00 (NYSE)." },
      { date: "2026-04-17", type: "Debut", desc: "Opened $23.01, closed $26.93 (+35%) on 16.7M shares." },
    ],
    riskFlags: [
      "Up ~35% from offer — chasing strength carries drawdown risk.",
      "Defense-procurement timing and budget dependence.",
      "Thin post-IPO float can amplify volatility.",
    ],
    verdict:
      "<strong>Strongest tape of the defense cohort — respect it, but wait for a base.</strong> Buyers controlled day one; let it consolidate before adding rather than chasing green candles.",
    howToPlay: [
      { text: "Wait for base $22–24", tone: "info" },
      { text: "War-tech momentum watch", tone: "warning" },
    ],
  },
  {
    id: "elmt", ticker: "ELMT", name: "Elmet Group", status: "priced",
    categories: ["Critical Materials", "Defense / Space"],
    exchange: "NASDAQ", ipoDate: "2026-04-23",
    offerSize: "$120.0M", priceRange: null, ipoPrice: 14.00, sharesOffered: "8.6M",
    openPrice: 18.00, closePrice: 17.91, lastPrice: 17.91,
    note: "Critical materials + aerospace/defense supply chain. IPO $14, close $17.91, but down over the month. Interesting after cooldown.",
    lead:
      'A <strong>critical-materials</strong> supply-chain play tied to aerospace/defense. Tungsten and refractory-metals maker Elmet priced at <strong>$14</strong>, opened $18.00 and closed <strong>$17.91</strong> (+28%) — but has drifted lower over the month. Interesting <strong>after the cooldown</strong>, not at the pop.',
    pillars: [
      { title: "1 · Tungsten & refractory metals", tag: "Critical inputs", tagTone: "success", body: "Refractory metals are strategic inputs for aerospace, defense and munitions — supply-chain scarcity is the thesis." },
      { title: "2 · Defense + materials overlap", tag: "Dual theme", tagTone: "info", body: "Sits at the intersection of critical materials and the defense buildout — exposure to two secular bids at once." },
      { title: "3 · Cooled off — re-rate setup", tag: "Post-pop", tagTone: "warning", body: "$14 → $17.91 close, then faded over the month. The interesting entry is after the debut enthusiasm clears." },
    ],
    filings: [
      { date: "2026-04-23", type: "424B4", desc: "Priced 8.6M shares at $14.00 (NASDAQ)." },
      { date: "2026-04-23", type: "Debut", desc: "Opened $18.00, closed $17.91 on 9.7M shares." },
    ],
    riskFlags: [
      "Momentum has faded since debut — wait for it to stop going down.",
      "Small offer ($120M) and float — liquidity and volatility risk.",
      "Commodity-price and end-market (defense/aero) cyclicality.",
    ],
    verdict:
      "<strong>Watch for a base after the cooldown — don’t catch the falling knife.</strong> Compelling dual critical-materials/defense theme; the edge is buying the stabilization, not the debut.",
    howToPlay: [
      { text: "Watch for base near offer", tone: "info" },
      { text: "Add on stabilization", tone: "warning" },
    ],
  },
  {
    id: "rea", ticker: "REA", name: "Rare Earths Americas", status: "priced",
    categories: ["Critical Materials"],
    exchange: "NYSE", ipoDate: "2026-05-06",
    offerSize: "$63.3M", priceRange: null, ipoPrice: 19.00, sharesOffered: "3.3M",
    openPrice: 25.00, closePrice: 19.00, lastPrice: 19.00,
    note: "Nice narrative, but it round-tripped: IPO $19, open $25, close $19. Watch, don’t chase.",
    lead:
      'A <strong>rare-earths / China-dependence</strong> narrative that <strong>round-tripped on day one</strong>. REA priced at <strong>$19</strong>, spiked to a <strong>$25</strong> open (+32%), then gave it all back to close at <strong>$19</strong> — exactly the offer. A textbook “watch, don’t chase.”',
    pillars: [
      { title: "1 · Rare-earths independence theme", tag: "De-China", tagTone: "info", body: "Rare-earth supply outside Chinese control is a genuine strategic priority — the narrative has real policy backing." },
      { title: "2 · But the tape round-tripped", tag: "$25 → $19", tagTone: "danger", body: "Opened +32% and surrendered the entire gain to close flat at the $19 offer. Day-one buyers were trapped." },
      { title: "3 · Tiny deal, big swings", tag: "$63M offer", tagTone: "warning", body: "Only 3.3M shares / $63M — a micro-float that whips around on low volume. Treat with caution." },
    ],
    filings: [
      { date: "2026-05-06", type: "424B4", desc: "Priced 3.3M shares at $19.00 (NYSE)." },
      { date: "2026-05-06", type: "Debut", desc: "Opened $25.00, round-tripped to close $19.00 on 3.4M shares." },
    ],
    riskFlags: [
      "Round-tripped to the offer on debut — momentum buyers got burned.",
      "Micro-cap float ($63M) — illiquid and prone to violent moves.",
      "Rare-earth project economics are notoriously hard and slow.",
    ],
    verdict:
      "<strong>Watch only — do not chase.</strong> Great theme, ugly tape. The day-one round-trip is a warning; demand a real base and confirmed demand before touching it.",
    howToPlay: [
      { text: "Watchlist only", tone: "warning" },
      { text: "No chase without a base", tone: "danger" },
    ],
  },
  {
    id: "fisn", ticker: "FISN", name: "Deep Fission", status: "upcoming",
    categories: ["Nuclear", "AI Power / Energy"],
    exchange: "NASDAQ", ipoDate: "2026-05-29",
    offerSize: "$179.4M", priceRange: null, ipoPrice: null, sharesOffered: "6.0M",
    openPrice: null, closePrice: null, lastPrice: null,
    note: "Interesting — nuclear + AI power. But this one has real “story stock / careful bro” smell. ~$1.66B valuation target; going-concern style concerns flagged.",
    lead:
      'The <strong>spicy</strong> nuclear name. Deep Fission targets a <strong>~$1.66B</strong> valuation on its NASDAQ debut (~$179M offer, 6.0M shares) on a nuclear + AI-power story — but TechCrunch flagged <strong>financial / going-concern-style concerns</strong>. High narrative, high risk.',
    pillars: [
      { title: "1 · Nuclear + AI power story", tag: "Theme", tagTone: "info", body: "Rides the same AI-electricity / advanced-nuclear thesis as XE — the most fashionable narrative in the market." },
      { title: "2 · Ambitious valuation", tag: "~$1.66B", tagTone: "warning", body: "Reuters: targeting ~$1.66B. That is a rich tag for a pre-commercial advanced-nuclear concept." },
      { title: "3 · Going-concern smell", tag: "Careful bro", tagTone: "danger", body: "TechCrunch flagged financial / going-concern-style concerns — the classic story-stock red flag. Size accordingly." },
    ],
    filings: [
      { date: "2026-05-29", type: "Expected pricing", desc: "NASDAQ debut, 6.0M shares, ~$179.4M offer." },
      { date: "pre-IPO", type: "S-1 / press", desc: "TechCrunch flagged financial / going-concern-style concerns; ~$1.66B valuation target (Reuters)." },
    ],
    riskFlags: [
      "Going-concern-style concerns flagged in the press — read the S-1 risk factors.",
      "Pre-commercial advanced nuclear at a ~$1.66B target — valuation far ahead of fundamentals.",
      "Story-stock dynamics: easy to hype, easy to break.",
    ],
    verdict:
      "<strong>Story stock — tiny size or watch-only.</strong> The theme is seductive but the financials raise flags. If you play it at all, treat it as a speculative lottery ticket, not a position.",
    howToPlay: [
      { text: "Speculative / tiny size", tone: "danger" },
      { text: "Read the risk factors first", tone: "warning" },
    ],
  },
];

const IPO_ORDER = IPOS.map((x) => x.id);
const IPO_BY_ID = Object.fromEntries(IPOS.map((x) => [x.id, x]));

function ipoMetrics(rec) {
  const m = {};
  if (rec.ipoPrice != null && rec.openPrice != null) m.debutPop = ((rec.openPrice - rec.ipoPrice) / rec.ipoPrice) * 100;
  if (rec.ipoPrice != null && rec.closePrice != null) m.dayReturn = ((rec.closePrice - rec.ipoPrice) / rec.ipoPrice) * 100;
  if (rec.openPrice != null && rec.closePrice != null) m.fromOpen = ((rec.closePrice - rec.openPrice) / rec.openPrice) * 100;
  const latest = rec.lastPrice != null ? rec.lastPrice : rec.closePrice;
  if (rec.ipoPrice != null && latest != null) m.vsIpo = ((latest - rec.ipoPrice) / rec.ipoPrice) * 100;
  m.latest = latest;
  return m;
}

function ipoMatchesCategories(rec, selected) {
  if (!selected || selected.length === 0) return true;
  return rec.categories.some((c) => selected.includes(c));
}

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
