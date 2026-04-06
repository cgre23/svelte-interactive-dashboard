<script>
  import { createChart, ColorType, LineSeries } from 'lightweight-charts';
  import { chartData } from '../stores/chartData.svelte.js';

  let container = $state();
  let chart;
  let seriesMap = {}; // symbol -> ILineSeries (NOT $state — plain JS object)
  let tooltip = $state(null);

  $effect(() => {
    if (!container) return;

    chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a2e' },
        textColor: '#8080a0',
      },
      grid: {
        vertLines: { color: '#2e2e4a' },
        horzLines: { color: '#2e2e4a' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#2e2e4a' },
      timeScale: { borderColor: '#2e2e4a', timeVisible: true },
      width: container.clientWidth,
      height: 420,
    });

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        chart.resize(entry.contentRect.width, 420);
      }
    });
    observer.observe(container);

    chart.subscribeCrosshairMove(param => {
      if (!param.time || param.point === undefined) {
        tooltip = null;
        return;
      }
      const items = [];
      for (const [symbol, series] of Object.entries(seriesMap)) {
        const val = param.seriesData.get(series);
        if (val !== undefined) {
          items.push({ symbol, value: val.value });
        }
      }
      tooltip = items.length ? { x: param.point.x, y: param.point.y, items } : null;
    });

    return () => {
      observer.disconnect();
      chart.remove();
    };
  });

  $effect(() => {
    if (!chart) return;

    const current = chartData.normalizedSeries;
    const incoming = new Set(current.map(s => s.symbol));

    // Remove series no longer present
    for (const sym of Object.keys(seriesMap)) {
      if (!incoming.has(sym)) {
        chart.removeSeries(seriesMap[sym]);
        delete seriesMap[sym];
      }
    }

    // Add or update series
    for (const { symbol, color, points } of current) {
      if (!points.length) continue;
      if (!seriesMap[symbol]) {
        seriesMap[symbol] = chart.addSeries(LineSeries, {
          color,
          lineWidth: 2,
          priceFormat: { type: 'percent', precision: 2, minMove: 0.01 },
        });
      }
      seriesMap[symbol].setData(points);
    }

    if (current.some(s => s.points.length)) {
      chart.timeScale().fitContent();
    }
  });
</script>

<div class="chart-wrapper">
  <div bind:this={container} class="chart-container"></div>

  {#if tooltip}
    <div
      class="tooltip"
      style="left: {Math.min(tooltip.x + 16, container?.clientWidth - 140)}px; top: {Math.max(tooltip.y - 60, 8)}px"
    >
      {#each tooltip.items as item}
        <div class="tooltip-row">
          <span class="sym">{item.symbol}</span>
          <span class:pos={item.value >= 0} class:neg={item.value < 0}>
            {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)}%
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .chart-wrapper {
    position: relative;
    background: var(--surface);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .chart-container {
    width: 100%;
    height: 420px;
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    min-width: 120px;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    line-height: 1.7;
  }

  .sym {
    color: var(--text-muted);
    font-weight: 600;
  }

  .pos { color: var(--positive); }
  .neg { color: var(--negative); }
</style>
