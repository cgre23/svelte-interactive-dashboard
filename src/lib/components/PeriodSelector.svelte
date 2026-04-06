<script>
  import { PERIODS } from '../services/yahooFinance.js';
  import { store, setActivePeriod } from '../stores/tickers.svelte.js';
</script>

<div class="period-selector" role="group" aria-label="Time period">
  {#each PERIODS as period}
    <button
      class:active={store.activePeriod === period}
      onclick={() => setActivePeriod(period)}
    >
      {period}
    </button>
  {/each}
</div>

<style>
  .period-selector {
    display: flex;
    gap: 4px;
  }

  button {
    padding: 4px 10px;
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  button:hover {
    background: var(--surface-2);
    color: var(--text);
  }

  button.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
</style>
