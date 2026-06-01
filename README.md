# Investment Theses

Mobile-friendly static cards for **IBM**, **ServiceNow (NOW)**, **Nokia (NOK)**, and **Intel (INTC)**.

## Live site

**https://sneakingaround.github.io/free_food/**

Use that exact URL (project site under `/free_food/`). The repo root URL is not the app.

### If you still see an old version

1. Open **Settings** in the app — **build** should be a short git hash (e.g. `6d48a33`), not `__BUILD__` or `dev`.
2. Hard refresh: `Ctrl+Shift+R` (Safari: clear website data for `github.io`).
3. In **Telegram**: fully close the mini-app and reopen the bot link (it caches aggressively).
4. Confirm you are not opening a local `file://` copy or a different host (Vercel, etc.).

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
