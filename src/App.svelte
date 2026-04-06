<script>
  import { store } from './lib/stores/tickers.svelte.js';
  // Import to activate the $effect.root that drives data fetching
  import './lib/stores/chartData.svelte.js';

  import TickerSearch from './lib/components/TickerSearch.svelte';
  import TickerChip from './lib/components/TickerChip.svelte';
  import PeriodSelector from './lib/components/PeriodSelector.svelte';
  import Chart from './lib/components/Chart.svelte';
  import PerformanceTable from './lib/components/PerformanceTable.svelte';
  import LoadingOverlay from './lib/components/LoadingOverlay.svelte';
  import ErrorBanner from './lib/components/ErrorBanner.svelte';
</script>

<main>
  <header>
    <h1>Stock Comparison</h1>
    <TickerSearch />
  </header>

  <ErrorBanner />
  <LoadingOverlay />

  <div class="controls">
    <div class="chips">
      {#each store.tickers as ticker (ticker.symbol)}
        <TickerChip symbol={ticker.symbol} color={ticker.color} />
      {/each}
      {#if store.tickers.length === 0}
        <span class="hint">Add a ticker above to get started</span>
      {/if}
    </div>
    <PeriodSelector />
  </div>

  <Chart />
  <PerformanceTable />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .hint {
    color: var(--text-muted);
    font-size: 13px;
  }
</style>
