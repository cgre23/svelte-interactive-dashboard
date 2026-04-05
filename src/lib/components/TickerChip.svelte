<script>
  import { removeTicker } from '../stores/tickers.svelte.js';

  let { symbol, color } = $props();
</script>

<span class="chip" style="--color: {color}">
  <span class="dot"></span>
  {symbol}
  <button onclick={() => removeTicker(symbol)} aria-label="Remove {symbol}">✕</button>
</span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 10px;
    background: color-mix(in srgb, var(--color) 15%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--color) 40%, transparent);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color);
    white-space: nowrap;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color);
    flex-shrink: 0;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    padding: 0 0 0 2px;
    font-size: 12px;
    opacity: 0.6;
    line-height: 1;
    display: flex;
    align-items: center;
  }

  button:hover {
    opacity: 1;
  }
</style>
