import { fetchChart } from '../services/yahooFinance.js';
import { store, setLoading, setError } from './tickers.svelte.js';

class ChartDataStore {
  rawData = $state({});

  normalizedSeries = $derived.by(() => {
    return store.tickers.map(({ symbol, color }) => {
      const data = this.rawData[symbol];
      if (!data || data.length === 0) return { symbol, color, points: [] };
      const base = data[0].adjclose;
      if (!base) return { symbol, color, points: [] };
      const points = data.map(p => ({
        time: p.time,
        value: ((p.adjclose - base) / base) * 100,
      }));
      return { symbol, color, points };
    });
  });

  latestStats = $derived.by(() => {
    return store.tickers.map(({ symbol, color }) => {
      const data = this.rawData[symbol];
      if (!data || data.length < 2) {
        return { symbol, color, price: null, dayChange: null, dayChangePct: null, periodReturn: null };
      }
      const last = data[data.length - 1];
      const first = data[0];
      const prev = data[data.length - 2];
      const price = last.close ?? last.adjclose;
      const prevPrice = prev.close ?? prev.adjclose;
      const dayChange = price - prevPrice;
      const dayChangePct = prevPrice ? (dayChange / prevPrice) * 100 : null;
      const periodReturn = first.adjclose ? ((last.adjclose - first.adjclose) / first.adjclose) * 100 : null;
      return { symbol, color, price, dayChange, dayChangePct, periodReturn };
    });
  });
}

export const chartData = new ChartDataStore();

$effect.root(() => {
  $effect(() => {
    const syms = store.tickers.map(t => t.symbol);
    const period = store.activePeriod;
    fetchAll(syms, period);
  });
});

async function fetchAll(symbols, period) {
  if (symbols.length === 0) {
    for (const key of Object.keys(chartData.rawData)) delete chartData.rawData[key];
    return;
  }
  setLoading(true);
  setError(null);
  try {
    const results = await Promise.allSettled(
      symbols.map(s => fetchChart(s, period))
    );
    const next = {};
    for (const [i, result] of results.entries()) {
      if (result.status === 'fulfilled') {
        next[symbols[i]] = result.value.pairs;
      } else {
        next[symbols[i]] = [];
        setError(`Failed to load ${symbols[i]}: ${result.reason?.message ?? 'unknown error'}`);
      }
    }
    for (const key of Object.keys(chartData.rawData)) delete chartData.rawData[key];
    Object.assign(chartData.rawData, next);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
