# Blackjack Trainer Pro

Web app Next.js 14 per allenare blackjack, conteggio carte e basic strategy con UX mobile-first e PWA offline-ready.

## Context
- Drill di conteggio e decisioni con regole configurabili (preset Vegas/Atlantic City/Single Deck).
- Conteggio carte multi-sistema (Hi-Lo, KO, Omega II, Hi-Opt I, Zen) con hint opzionali.
- Telemetria locale in-memory con esportazione JSON (nessun dato inviato).
- PWA con cache di /drills, asset essenziali e pagina offline dedicata.

## Setup locale
```bash
pnpm i
pnpm dev
```
L&apos;app è disponibile su `http://localhost:3000`.

## Test e lint
```bash
pnpm lint
pnpm test
```

## Build
```bash
pnpm build
```
La build è ottimizzata per Vercel (Next.js 14 + next-pwa). Nessuna variabile d&apos;ambiente necessaria: tutto è local-first.

## Deploy su Vercel
```bash
vercel
vercel --prod
```
- Importa la repo su Vercel e usa i comandi di default.
- Le preview deployments ereditano la configurazione PWA e le impostazioni locali rimangono sul device client.

## Funzionalità chiave
- Preset regole: Vegas 6D S17, Atlantic City 8D H17, Single Deck H17, con toggles per DAS/RSA/surrender/CSM/double.
- Conteggio carte: selettore sistema con hint, feedback configurabile (show/hide hints).
- Drill offline: cache aggressiva di /drills e asset statici, fallback `/offline` per mancanza di rete.
- Telemetria locale: pannello in Impostazioni con log sessione, copia JSON, reset rapido (in-memory, non persistente).
- Backup: export/import JSON delle impostazioni e statistiche locali.

## PWA
- Manifest in `public/manifest.json`, service worker generato via `next-pwa` con cache di pagine, asset e metadata.
- `next.config.mjs` abilita `NetworkFirst` per le pagine drill e fallback document `/offline`.

## Note
- Nessun asset binario incluso.
- Stili con Tailwind CSS + componenti custom, accessibilità ARIA sulle interazioni.
