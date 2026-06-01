#!/usr/bin/env python3
"""Download market + fundamentals for thesis tickers (Yahoo Finance)."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from pathlib import Path

import pandas as pd
import yfinance as yf

SYMBOLS = {"ibm": "IBM", "now": "NOW", "nok": "NOK", "intc": "INTC"}
OUT = Path(__file__).resolve().parent / "market"

# Pre-2021 annual diluted EPS (GAAP) — fills Yahoo's short history for 10y charts.
SEED_ANNUAL_EPS: dict[str, dict[int, float]] = {
    "IBM": {2016: 12.98, 2017: 6.13, 2018: 9.51, 2019: 10.57, 2020: 8.67},
    "NOW": {2016: -0.46, 2017: -0.01, 2018: 0.35, 2019: 0.54, 2020: 1.74},
    "NOK": {2016: 0.22, 2017: 0.21, 2018: 0.14, 2019: 0.05, 2020: -0.04},
    "INTC": {2016: 2.12, 2017: 3.43, 2018: 4.48, 2019: 4.71, 2020: 4.94},
}


def fetch_bars(symbol: str, range_: str = "6mo", interval: str = "1d") -> list[dict]:
    params = urllib.parse.urlencode({"interval": interval, "range": range_})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "investment-theses/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode())

    result = data["chart"]["result"][0]
    timestamps = result["timestamp"]
    q = result["indicators"]["quote"][0]
    bars = []
    for i, t in enumerate(timestamps):
        o, h, l, c, v = q["open"][i], q["high"][i], q["low"][i], q["close"][i], q["volume"][i]
        if None in (o, h, l, c) or c is None:
            continue
        bars.append(
            {
                "t": int(t),
                "o": round(float(o), 4),
                "h": round(float(h), 4),
                "l": round(float(l), 4),
                "c": round(float(c), 4),
                "v": int(v or 0),
            }
        )
    return bars


def fetch_annual_eps(symbol: str) -> dict[int, float]:
    out: dict[int, float] = dict(SEED_ANNUAL_EPS.get(symbol, {}))
    try:
        inc = yf.Ticker(symbol).income_stmt
        if inc is not None and "Diluted EPS" in inc.index:
            series = inc.loc["Diluted EPS"].dropna()
            for ts, val in series.items():
                year = int(pd.Timestamp(ts).year)
                out[year] = round(float(val), 2)
    except Exception as exc:  # noqa: BLE001
        print(f"  warn annual EPS {symbol}: {exc}")
    return out


def fetch_quarterly_earnings(symbol: str, limit: int = 40) -> list[dict]:
    rows: list[dict] = []
    try:
        ed = yf.Ticker(symbol).earnings_dates
        if ed is None or ed.empty:
            return rows
        for ts, row in ed.iterrows():
            reported = row.get("Reported EPS")
            if pd.isna(reported):
                continue
            estimate = row.get("EPS Estimate")
            rows.append(
                {
                    "date": pd.Timestamp(ts).strftime("%Y-%m-%d"),
                    "eps": round(float(reported), 2),
                    "estimate": round(float(estimate), 2) if pd.notna(estimate) else None,
                }
            )
    except Exception as exc:  # noqa: BLE001
        print(f"  warn quarterly earnings {symbol}: {exc}")
    rows.sort(key=lambda r: r["date"])
    return rows[-limit:]


def annual_eps_series(symbol: str) -> list[dict]:
    merged = fetch_annual_eps(symbol)
    years = sorted(merged.keys())
    return [{"year": str(y), "eps": merged[y]} for y in years if y >= 2016]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for key, sym in SYMBOLS.items():
        print(f"{sym}…")
        bars_6mo = fetch_bars(sym, "6mo", "1d")
        bars_10y = fetch_bars(sym, "10y", "1mo")
        annual = annual_eps_series(sym)
        quarterly = fetch_quarterly_earnings(sym)

        payload = {
            "id": key,
            "symbol": sym,
            "range": "6mo",
            "interval": "1d",
            "bars": bars_6mo,
            "bars10y": bars_10y,
            "range10y": "10y",
            "interval10y": "1mo",
            "earningsAnnual": annual,
            "earningsQuarterly": quarterly,
            "fetchedAt": pd.Timestamp.now("UTC").strftime("%Y-%m-%d"),
        }
        path = OUT / f"{key}.json"
        path.write_text(json.dumps(payload, separators=(",", ":")))
        print(
            f"  {path.name}: 6mo={len(bars_6mo)} 10y={len(bars_10y)} "
            f"annual_eps={len(annual)} quarterly={len(quarterly)} "
            f"last=${bars_6mo[-1]['c']:.2f}"
        )


if __name__ == "__main__":
    main()
