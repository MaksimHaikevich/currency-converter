# Currency Converter (Vite + React + TypeScript)

A small, production‑grade currency converter demonstrating a pragmatic FSD‑lite architecture, strict TypeScript across API/domain, offline caching, skeletons, friendly errors, and accessible UI (keyboard‑navigable currency picker).

## Features
- **Typed API**: strict TypeScript for transport, normalization, and domain (`convert`, `getRate`).
- **Caching & Offline**: last successful response (base, rates, timestamp) is stored in `localStorage`. Offline mode reads the cache and shows timestamp; cache expires in **5 minutes** with **background auto‑refresh** when online.
- **UX**: debounced amount input, throttled manual refresh, skeletons while loading, friendly error banners, and explicit online/offline indicator.
- **Accessibility**: Currency picker with proper roles (`dialog`, `listbox`, `option`), keyboard navigation (↑/↓/Enter/Esc).
- **Styling**: SCSS Modules + small global layer (`Inter` font).

## Tech stack
- Vite, React 18+, TypeScript (strict)
- SCSS Modules (`@fontsource/inter` for fonts)
- Lightweight custom hooks (`useDebouncedValue`, `useThrottle`, `useNetworkStatus`, `useLocalStorage`)

---

## Setup requirements
- **Node.js**: v18+ (LTS recommended)
- **Package manager**: `npm` (project contains `package-lock.json`)

```bash
# install
npm ci

# run dev
npm run dev

# build
npm run build

# preview production build
npm run preview
```

---

## Environment (.env)
Create `.env` from example and adjust values:

```bash
cp .env.example .env
```

**Variables**

```dotenv
# Base URL of the FX provider (defaults to fxratesapi.com latest endpoint)
VITE_RATES_BASE_URL=https://api.fxratesapi.com/latest

# Optional API key depending on your provider plan (leave empty if not required)
VITE_RATES_API_KEY=
```

> The app reads `import.meta.env` vars at build time. Restart dev server after changes.

---

## Architecture (FSD‑lite)

```
src/
  app/                      # App shell, global styles
    styles/                # _vars.scss, _mixins.scss, global.scss
    App.tsx
    main.tsx

  entities/
    currency/              # Entity: currency
      data/currencies.json
      ui/CurrencyPicker/   # Trigger, Dialog, OptionRow (+ helpers, types)

  features/
    convert/
      model/               # Context store (state, reducer, hooks)
      ui/                  # AmountInput, ConverterForm, ResultCard, SwapButton

  shared/
    api/rates/             # Transport (fetch), normalization, domain wrapper
    assets/icons           # Inline SVG React icons
    lib/                   # hooks (debounce/throttle/network), utils (cache/constants/format)
    ui/                    # Reusable primitives (HeaderBar, NetworkIndicator, RefreshButton, ErrorBanner, Skeleton)
```

### Key decisions
- **API choice**: `fxratesapi.com /latest` (base currency via query param). Transport is isolated and normalized to a domain shape:
  ```ts
  type RatesResponse = { base: string; date?: string; rates: Record<string, number> };
  ```
- **Caching strategy**:
    - On each success we write `{ payload: RatesResponse, timestamp }` to `localStorage` under a stable key.
    - TTL is **5 minutes** (`CACHE_TTL_MS`). After TTL, the app schedules a **background refresh** (so UI stays responsive).
    - Manual refresh is **throttled** by `REFRESH_THROTTLE_MS`.
- **Formatting**:
    - `sanitizeAmountInput` accepts digits with `.` or `,` decimal separators.
    - `toNumberSafe` normalizes user input to a safe number.
    - `formatNumber` uses `Intl.NumberFormat` (locale can be pinned, e.g. `en-US` for `.` decimals, if desired).

### Data flow
- **Store**: `features/convert/model` exposes a context with `state { from, to, amount }` and actions (`setFrom`, `setTo`, `setAmount`, `swap`).
- **App**:
    - Loads rates via `shared/api/rates`.
    - Persists last payload to `localStorage` and exposes timestamp to the header (`Last updated …` or `Using cached rates from …` when offline).
    - Computes `converted`, `rate`, and `inverseRate` via domain helpers.

---

## Development notes
- **Keyboard**: In the currency dialog, arrow keys change the active option, `Enter` selects, `Esc` closes. Scroll position follows the active option.
- **Perf**: No premature memoization; only localized `useMemo` where it reduces work (e.g., derived values). Refresh button uses a throttled handler.
- **Styling**: SCSS variables/mixins live in `app/styles/_vars.scss` and `_mixins.scss`; components use CSS Modules. Global styles import `normalize.css` and `Inter` weights.

---

## **Demo**: https://currency-converter-valetax.netlify.app/

