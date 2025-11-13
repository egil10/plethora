# NordNotes

NordNotes er en moderne, statisk SPA (React + Vite + TypeScript) som demonstrerer hvordan FileFora-konseptet kan videreutvikles til en rettferdig og nordisk-fokusert markedsplass for studie­notater. All data lagres lokalt i nettleserens `localStorage`, og betalinger simuleres – men arkitekturen er klar for Vipps, Stripe eller Nets når ekte backend kobles til.

## Teknologi

- Vite + React 18 + TypeScript
- React Router (HashRouter for GitHub Pages)
- Egendefinerte komponenter med moderne, responsiv CSS
- Context + hooks for datahåndtering med lagring i `localStorage`

## Kom i gang

```bash
npm install
npm run dev
```

Åpne deretter `http://localhost:5173/` (porten kan variere) i nettleseren.

## Bygg

```bash
npm run build
```

Det ferdige bygget ligger i `dist/`.

## Deploy til GitHub Pages

Prosjektet er satt opp med `gh-pages`. Sørg for at repoet er initialisert og at du har rettigheter til å pushe til `gh-pages`-branchen.

```bash
npm run deploy
```

Skriptet kjører `vite build` og publiserer innholdet i `dist/` til `gh-pages`.

> Tips: Hvis repoet ditt ligger under en organisasjon/bruker, trenger du ikke endre noe. For publisering til et underkatalognavn (`username.github.io/repo`), kan du legge til `homepage`-feltet i `package.json`, f.eks. `"homepage": "https://username.github.io/repo"`.

## Viktige detaljer

- **App-navn og plattformgebyr** styres fra `src/config.ts`. Endre her for å tilpasse.
- **Demo-data** seedes automatisk ved første kjøring (se `src/utils/seed.ts`). Data skrives kun hvis `localStorage` er tom eller seed-versjonen endres.
- **HashRouter** sikrer at appen fungerer på GitHub Pages uten ekstra serverkonfigurasjon.
- **Simulerte betalinger**: kjøp registreres som transaksjoner i `localStorage`, selgerens saldo oppdateres, og checkout-visningen viser hvordan Vipps/Stripe enkelt kan kobles på senere.

## Avgrensninger i MVP-en

- Ingen ekte opplasting av filer – dokumenter peker til placeholder-URL-er.
- Autentisering er en enkel bruker-velger som bytter mellom seedede demo-brukere.
- Betalinger, kvitteringer og utbetalinger er simulert.
- All data kan nullstilles ved å tømme nettleserens `localStorage`.

## Neste steg (forslag)

- Koble `storage`-laget til Supabase/Firebase eller en egen backend.
- Aktivere Vipps/Stripe Checkout med webhooks for ekte betalingsflyt.
- Ekte filopplasting til Object Storage (f.eks. Supabase Storage eller S3).
- Varsler, deling av lenker og modereringsverktøy for dokumenter og brukere.

God bygging! 💙