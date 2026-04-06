const COLORS = [
  '#7b7bff', '#ff7b7b', '#7bffb0', '#ffda7b',
  '#7bdcff', '#ff7bf5', '#b0ff7b', '#ffb07b',
];

let colorIndex = 0;
function nextColor() {
  return COLORS[colorIndex++ % COLORS.length];
}

export const store = $state({
  tickers: [],
  activePeriod: '1Y',
  isLoading: false,
  globalError: null,
});

export function addTicker(symbol) {
  const upper = symbol.toUpperCase().trim();
  if (!upper) return;
  if (store.tickers.find(t => t.symbol === upper)) return;
  store.tickers.push({ symbol: upper, color: nextColor() });
}

export function removeTicker(symbol) {
  const idx = store.tickers.findIndex(t => t.symbol === symbol);
  if (idx !== -1) store.tickers.splice(idx, 1);
}

export function setActivePeriod(period) {
  store.activePeriod = period;
}

export function setLoading(val) {
  store.isLoading = val;
}

export function setError(msg) {
  store.globalError = msg;
}
