# Svelte Interactive Stock Dashboard

A real-time stock and ETF comparison dashboard built with **Svelte 5** and **Vite**. Add multiple tickers, plot their normalized % returns on a shared chart, and compare performance across 8 time periods — all powered by live Yahoo Finance data with no API key required.

---

## Features

- **Multi-ticker comparison** — add any stock or ETF and plot them together on a normalized % return chart
- **8 time periods** — 1D, 5D, MTD, 1M, 1Y, 3Y, 5Y, Max
- **Performance table** — live price, day change, and period return for each ticker
- **Dark theme** — clean dark UI with color-coded positive/negative values
- **Crosshair tooltip** — hover the chart to see all ticker values at the same timestamp
- **Responsive** — chart resizes cleanly with the browser window
- **No API key** — data fetched via `yahoo-finance2` through a local Vite proxy

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | [Svelte 5](https://svelte.dev) + [Vite](https://vite.dev) |
| Charts | [lightweight-charts v5](https://tradingview.github.io/lightweight-charts/) (TradingView) |
| Data | [yahoo-finance2](https://github.com/gadicc/yahoo-finance2) |
| State | Svelte 5 runes (`$state`, `$derived`, `$effect`) |
| Styling | CSS custom properties, dark theme |

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

---

## Installation

**1. Clone the repo**

```bash
git clone https://github.com/christiangrech/svelte-interactive-dashboard.git
cd svelte-interactive-dashboard
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

**4. Open in your browser**

```
http://localhost:5173
```

---

## Usage

1. Type a ticker symbol in the search box (e.g. `AAPL`, `MSFT`, `SPY`) and click **+ Add**
2. Add as many tickers as you want — each gets a distinct color
3. Use the period buttons to switch between **1D / 5D / MTD / 1M / 1Y / 3Y / 5Y / Max**
4. Hover over the chart to see a crosshair tooltip with all values at that date
5. Click **×** on any chip to remove a ticker

> **European ETFs:** Yahoo Finance uses exchange suffixes — use `VWCE.DE` (Xetra), `VWCE.L` (London), `EUNL.DE`, etc.

---

## Project Structure

```
src/
├── App.svelte                     # Layout shell
├── app.css                        # Global dark theme CSS variables
└── lib/
    ├── services/
    │   └── yahooFinance.js        # Data fetching + period date helpers
    ├── stores/
    │   ├── tickers.svelte.js      # Tickers list, active period, loading/error state
    │   └── chartData.svelte.js    # Raw data, normalized series, stats (class-based runes)
    └── components/
        ├── Chart.svelte           # lightweight-charts canvas + crosshair tooltip
        ├── TickerSearch.svelte    # Symbol input + validation
        ├── TickerChip.svelte      # Colored pill with remove button
        ├── PeriodSelector.svelte  # Period button row
        ├── PerformanceTable.svelte# Price, day change, period return table
        ├── LoadingOverlay.svelte  # Animated loading bar
        └── ErrorBanner.svelte     # Auto-dismissing error message
```

---

## Background

Yahoo Finance's API requires session authentication that can't be called from the browser directly. The app solves this with a **Vite dev-server plugin** that intercepts requests to `/api/chart` and proxies them through `yahoo-finance2` on the Node.js side — no CORS issues, no API key needed.

Data is normalized to **% return from the start of the selected period**, so tickers with very different price levels (e.g. AAPL at $200 vs SPY at $500) can be compared on the same scale.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:5173` |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Production Deployment

The Vite dev-server plugin that proxies Yahoo Finance **only works in development**. For a production deployment, move the data fetching to a proper server route:

- **SvelteKit** — convert the project and add a `src/routes/api/chart/+server.js` route
- **Express / Hono** — create a `/api/chart` endpoint using `yahoo-finance2`
- **Serverless** — deploy as a Vercel or Netlify function

The Svelte stores and all components work as-is in any of these setups.

---

## License

MIT
