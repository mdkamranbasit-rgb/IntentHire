# IntentHire — Resume Intelligence Prototype

A Vite + React prototype for comparing 47 anonymized resumes against two job descriptions. The initial dataset is preprocessed from DOCX files. New PDF/DOCX uploads are extracted and ranked in the browser session.

## Run locally

```bash
npm install
npm run dev
```

## Build for Vercel

```bash
npm run build
```

Deploy as a Vite project on Vercel. Build command: `npm run build`; output directory: `dist`.

## Data notes
- Original ZIP is not modified.
- `public/data/candidates.json` contains extracted candidate evidence and first-pass scores.
- `public/resumes/` contains the 47 original DOCX source files for reviewer inspection.
- New uploads are processed locally in the browser and are not uploaded to a server or persisted after refresh.
- See `METHODOLOGY.md` for scoring weights, thresholds, limitations, and the LCA experience discrepancy.
