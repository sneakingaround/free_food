# Investment Theses

Mobile-friendly static cards for **IBM**, **ServiceNow (NOW)**, **Nokia (NOK)**, and **Intel (INTC)**.

## Live site

**https://sneakingaround.github.io/free_food/**

### If you see 404 (one-time fix)

1. Open **https://github.com/sneakingaround/free_food/settings/pages**
2. **Build and deployment** → **Deploy from a branch**
3. Branch **`main`** · Folder **`/docs`**
4. Save — wait ~1 minute, then reload the URL above

## Local

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

```bash
python3 fetch-market.py   # refresh OHLCV JSON
```

## Deploy

Push to `main` (workflow updates `docs/` automatically):

```bash
git push origin main
```
