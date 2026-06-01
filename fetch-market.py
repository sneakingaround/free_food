#!/usr/bin/env python3
"""Download 6mo daily OHLCV for thesis tickers (Yahoo chart API)."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from pathlib import Path

SYMBOLS = {"ibm": "IBM", "now": "NOW", "nok": "NOK", "intc": "INTC"}
OUT = Path(__file__).resolve().parent / "market"


def fetch_bars(symbol: str, range_: str = "6mo") -> list[dict]:
    params = urllib.parse.urlencode({"interval": "1d", "range": range_})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "investment-theses/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
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


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for key, sym in SYMBOLS.items():
        bars = fetch_bars(sym)
        payload = {
            "id": key,
            "symbol": sym,
            "range": "6mo",
            "interval": "1d",
            "bars": bars,
        }
        path = OUT / f"{key}.json"
        path.write_text(json.dumps(payload, separators=(",", ":")))
        print(f"{path.name}: {len(bars)} bars, last ${bars[-1]['c']:.2f}")


if __name__ == "__main__":
    main()
