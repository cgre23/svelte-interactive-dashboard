<script>
  import { chartData } from '../stores/chartData.svelte.js';
  import { store } from '../stores/tickers.svelte.js';

  function fmt(n, digits = 2) {
    if (n == null || isNaN(n)) return '—';
    return n.toFixed(digits);
  }

  function fmtPrice(n) {
    if (n == null || isNaN(n)) return '—';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function sign(n) {
    if (n == null) return '';
    return n >= 0 ? '+' : '';
  }
</script>

{#if chartData.latestStats.length > 0}
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Day Chg</th>
          <th>Day %</th>
          <th>{store.activePeriod} Return</th>
        </tr>
      </thead>
      <tbody>
        {#each chartData.latestStats as row}
          <tr>
            <td>
              <span class="sym-dot" style="background: {row.color}"></span>
              {row.symbol}
            </td>
            <td>{fmtPrice(row.price)}</td>
            <td class:pos={row.dayChange >= 0} class:neg={row.dayChange < 0}>
              {sign(row.dayChange)}{fmtPrice(row.dayChange)}
            </td>
            <td class:pos={row.dayChangePct >= 0} class:neg={row.dayChangePct < 0}>
              {sign(row.dayChangePct)}{fmt(row.dayChangePct)}%
            </td>
            <td class:pos={row.periodReturn >= 0} class:neg={row.periodReturn < 0}>
              {sign(row.periodReturn)}{fmt(row.periodReturn)}%
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .table-wrapper {
    overflow-x: auto;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th, td {
    padding: 10px 16px;
    text-align: right;
    white-space: nowrap;
  }

  th:first-child, td:first-child {
    text-align: left;
  }

  th {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 12px;
    border-bottom: 1px solid var(--border);
  }

  tr + tr td {
    border-top: 1px solid var(--border);
  }

  .sym-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }

  .pos { color: var(--positive); }
  .neg { color: var(--negative); }
</style>
