// Palette of distinct colors for ticker lines
const COLORS = [
  '#7b7bff', '#ff7b7b', '#7bffb0', '#ffda7b',
  '#7bdcff', '#ff7bf5', '#b0ff7b', '#ffb07b',
];

let colorIndex = 0;

function nextColor() {
  return COLORS[colorIndex++ % COLORS.length];
}

// Module-level reactive state (Svelte 5 runes)
export let tickers = $state([]);
export let activePeriod = $state('1Y');
export let isLoading = $state(false);
export let globalError = $state(null);

export function addTicker(symbol) {
  const upper = symbol.toUpperCase().trim();
  if (!upper) return;
  if (tickers.find(t => t.symbol === upper)) return;
  tickers.push({ symbol: upper, color: nextColor() });
}

export function removeTicker(symbol) {
  const idx = tickers.findIndex(t => t.symbol === symbol);
  if (idx !== -1) tickers.splice(idx, 1);
}

export function setActivePeriod(period) {
  activePeriod = period;
}

export function setLoading(val) {
  isLoading = val;
}

export function setError(msg) {
  globalError = msg;
}
