import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

/** @type {import('vite').Plugin} */
const yahooApiPlugin = {
  name: 'yahoo-finance-api',
  configureServer(server) {
    server.middlewares.use('/api/chart', async (req, res) => {
      try {
        const { default: YahooFinance } = await import('yahoo-finance2');
        const yf = new YahooFinance({ suppressNotices: ['ripHistorical'] });
        const url = new URL(req.url, 'http://localhost');
        const symbol = url.searchParams.get('symbol');
        const period1 = url.searchParams.get('period1');
        const period2 = url.searchParams.get('period2');
        const interval = url.searchParams.get('interval') ?? '1d';

        if (!symbol || !period1) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'missing symbol or period1' }));
          return;
        }

        const result = await yf.chart(symbol, {
          period1,
          period2: period2 ?? new Date().toISOString(),
          interval,
        });

        // chart() returns { quotes: [...] }, normalise to flat array
        const quotes = (result.quotes ?? []).map(q => ({
          date: q.date,
          open: q.open,
          close: q.close,
          adjclose: q.adjclose,
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(quotes));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  },
};

export default defineConfig({
  plugins: [svelte(), yahooApiPlugin],
})
