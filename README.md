# Blackjack Trainer Pro

Web app Next.js 14 per allenare blackjack, conteggio carte e basic strategy con design originale.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + componenti custom
- Zustand per stato
- Dexie/IndexedDB per persistenza locale
- next-pwa per PWA offline-ready
- Vitest + Testing Library per test

## Setup locale
```bash
npm install
npm run dev
```
L&apos;app è disponibile su `http://localhost:3000`.

## Test e lint
```bash
npm run lint
npm run test
```

## Build e deploy (Vercel)
```bash
npm run build
```
Il progetto è pronto per essere connesso a Vercel; basta importare la repository e usare i comandi di default.

## PWA
Manifest disponibile in `public/manifest.json`, con cache gestita da `next-pwa` (disattivata in sviluppo). Icona SVG personalizzata.

## Note
- Nessun asset binario incluso; design originale con palette scura e accenti verdi.
- Le impostazioni e i profili sono salvati localmente (IndexedDB + localStorage persist store Zustand).
