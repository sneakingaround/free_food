# Investment Theses

Mobile-friendly static cards for **IBM**, **ServiceNow (NOW)**, **Nokia (NOK)**, and **Intel (INTC)** — thesis fundamentals, valuation scenarios, and price charts with VPVR.

## Live site

**https://sneakingaround.github.io/free_food/**

(After the first push, enable **Settings → Pages → Source: GitHub Actions** if needed.)

## Local

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

Refresh OHLCV:

```bash
python3 fetch-market.py
```

## Deploy

```bash
./deploy-github.sh
```

Requires SSH access to `git@github.com:sneakingaround/*` and one-time `gh auth login` (device code) to create the repo if it does not exist yet.
