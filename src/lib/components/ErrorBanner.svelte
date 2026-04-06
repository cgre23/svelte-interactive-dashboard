<script>
  import { store, setError } from '../stores/tickers.svelte.js';

  let visible = $state(false);
  let timer;

  $effect(() => {
    if (store.globalError) {
      visible = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        visible = false;
        setError(null);
      }, 4000);
    }
  });
</script>

{#if visible && store.globalError}
  <div class="error-banner" role="alert">
    <span>{store.globalError}</span>
    <button onclick={() => { visible = false; setError(null); }}>✕</button>
  </div>
{/if}

<style>
  .error-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    background: rgba(255, 23, 68, 0.15);
    border: 1px solid var(--negative);
    border-radius: 6px;
    color: #ff6b8a;
    font-size: 13px;
    margin-bottom: 12px;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    padding: 2px 4px;
    opacity: 0.7;
    font-size: 14px;
    line-height: 1;
  }

  button:hover {
    opacity: 1;
  }
</style>
