export const PERIODS = ['1D', '5D', 'MTD', '1M', '1Y', '3Y', '5Y', 'Max'];

function getPeriodDates(period) {
  const now = new Date();
  const period2 = now.toISOString();
  let period1;
  let interval;

  switch (period) {
    case '1D': {
      const d = new Date(now); d.setDate(d.getDate() - 5);
      period1 = d.toISOString(); interval = '1d';
      break;
    }
    case '5D': {
      const d = new Date(now); d.setDate(d.getDate() - 10);
      period1 = d.toISOString(); interval = '1d';
      break;
    }
    case 'MTD': {
      period1 = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      interval = '1d';
      break;
    }
    case '1M': {
      const d = new Date(now); d.setMonth(d.getMonth() - 1);
      period1 = d.toISOString(); interval = '1d';
      break;
    }
    case '1Y': {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
      period1 = d.toISOString(); interval = '1d';
      break;
    }
    case '3Y': {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 3);
      period1 = d.toISOString(); interval = '1wk';
      break;
    }
    case '5Y': {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 5);
      period1 = d.toISOString(); interval = '1wk';
      break;
    }
    case 'Max': {
      period1 = '1970-01-01'; interval = '1mo';
      break;
    }
    default: {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
      period1 = d.toISOString(); interval = '1d';
    }
  }

  return { period1, period2, interval };
}

async function apiFetch(symbol, period) {
  const { period1, period2, interval } = getPeriodDates(period);
  const url = `/api/chart?symbol=${encodeURIComponent(symbol)}&period1=${encodeURIComponent(period1)}&period2=${encodeURIComponent(period2)}&interval=${interval}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

export async function fetchChart(symbol, period) {
  const quotes = await apiFetch(symbol, period);

  const pairs = quotes
    .filter(q => q.adjclose != null || q.close != null)
    .map(q => ({
      time: q.date.slice(0, 10), // 'YYYY-MM-DD' — required by lightweight-charts v5
      adjclose: q.adjclose ?? q.adjClose ?? q.close,
      close: q.close,
      open: q.open,
    }))
    .filter((p, i, arr) => i === 0 || p.time !== arr[i - 1].time); // dedupe same-day entries

  return { symbol, pairs };
}

export async function validateSymbol(symbol) {
  try {
    const quotes = await apiFetch(symbol, '1M');
    return Array.isArray(quotes) && quotes.length > 0;
  } catch {
    return false;
  }
}
