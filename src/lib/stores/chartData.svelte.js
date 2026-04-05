import { fetchChart } from '../services/yahooFinance.js';
import { tickers, activePeriod, setLoading, setError } from './tickers.svelte.js';

export let rawData = $state({});

export let normalizedSeries = $derived.by(() => {
  return tickers.map(({ symbol, color }) => {
    const data = rawData[symbol];
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

export let latestStats = $derived.by(() => {
  return tickers.map(({ symbol, color }) => {
    const data = rawData[symbol];
    if (!data || data.length < 2) return { symbol, color, price: null, dayChange: null, dayChangePct: null, periodReturn: null };
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

$effect.root(() => {
  $effect(() => {
    const syms = tickers.map(t => t.symbol);
    const period = activePeriod;
    fetchAll(syms, period);
  });
});

async function fetchAll(symbols, period) {
  if (symbols.length === 0) {
    rawData = {};
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
    rawData = next;
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
