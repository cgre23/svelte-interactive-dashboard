<script>
  import { isLoading } from '../stores/tickers.svelte.js';
</script>

{#if isLoading}
  <div class="loading-bar" aria-label="Loading…">
    <div class="fill"></div>
  </div>
{/if}

<style>
  .loading-bar {
    height: 3px;
    width: 100%;
    background: var(--surface-2);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .fill {
    height: 100%;
    width: 40%;
    background: var(--accent);
    border-radius: 2px;
    animation: slide 1.2s ease-in-out infinite;
  }

  @keyframes slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
</style>
