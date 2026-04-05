export const PERIODS = ['1D', '5D', 'MTD', '1M', '1Y', '3Y', '5Y', 'Max'];

const PERIOD_PARAMS = {
  '1D':  { range: '1d',  interval: '5m' },
  '5D':  { range: '5d',  interval: '15m' },
  'MTD': { range: 'ytd', interval: '1d' },
  '1M':  { range: '1mo', interval: '1d' },
  '1Y':  { range: '1y',  interval: '1d' },
  '3Y':  { range: '3y',  interval: '1wk' },
  '5Y':  { range: '5y',  interval: '1wk' },
  'Max': { range: 'max', interval: '1mo' },
};

export async function fetchChart(symbol, period) {
  const { range, interval } = PERIOD_PARAMS[period];
  const url = `/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includeAdjustedClose=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${symbol}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const timestamps = result.timestamp ?? [];
  const adjclose = result.indicators?.adjclose?.[0]?.adjclose ?? [];
  const quote = result.indicators?.quote?.[0] ?? {};
  const closes = quote.close ?? [];
  const opens = quote.open ?? [];

  // For MTD filter client-side to current month start
  let pairs = timestamps.map((t, i) => ({
    time: t,
    adjclose: adjclose[i] ?? closes[i],
    close: closes[i],
    open: opens[i],
  })).filter(p => p.adjclose != null);

  if (period === 'MTD') {
    const now = new Date();
    const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000;
    pairs = pairs.filter(p => p.time >= monthStart);
  }

  return {
    symbol,
    pairs,
    meta: result.meta ?? {},
  };
}

export async function validateSymbol(symbol) {
  const url = `/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
  const res = await fetch(url);
  if (!res.ok) return false;
  const json = await res.json();
  return !!(json?.chart?.result?.[0]);
}
