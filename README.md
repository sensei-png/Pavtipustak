# Pavti Pustak (पावती पुस्तक)

A digital receipt book: fill in a leaf, tear it off, and it's kept as a carbon-copy entry in your counterfoil ledger. Pure static HTML/CSS/JS — no build step, no backend. Data is saved in the visitor's browser (`localStorage`), so nothing leaves their device.

## Files
- `index.html` — page structure
- `style.css` — the ledger-paper / carbon-copy styling
- `script.js` — form handling, numbering, storage, printing
- `vercel.json` — static deployment config

## Deploy to Vercel

**Option A — Vercel dashboard (no CLI, easiest)**
1. Go to https://vercel.com/new
2. Choose "Deploy without Git" / drag-and-drop, and drop this whole `pavti-pustak` folder onto the page.
3. Vercel detects it as a static site — click **Deploy**. You'll get a live `*.vercel.app` URL in under a minute.

**Option B — Vercel CLI**
```bash
npm i -g vercel      # one-time install
cd pavti-pustak
vercel               # follow prompts, deploys a preview
vercel --prod        # promote to production URL
```

**Option C — GitHub + Vercel (best for ongoing edits)**
1. Push this folder to a new GitHub repo.
2. In Vercel, "Add New Project" → import that repo → Deploy.
3. Every future `git push` auto-deploys.

No environment variables or framework preset are needed — Vercel serves the static files as-is.
