<script>
  import { validateSymbol } from '../services/yahooFinance.js';
  import { addTicker, setError } from '../stores/tickers.svelte.js';

  let input = $state('');
  let validating = $state(false);
  let debounceTimer;

  async function submit(e) {
    e.preventDefault();
    const sym = input.trim().toUpperCase();
    if (!sym) return;

    validating = true;
    try {
      const valid = await validateSymbol(sym);
      if (valid) {
        addTicker(sym);
        input = '';
      } else {
        setError(`Symbol "${sym}" not found.`);
      }
    } catch {
      setError(`Could not validate "${sym}".`);
    } finally {
      validating = false;
    }
  }
</script>

<form class="ticker-search" onsubmit={submit}>
  <input
    type="text"
    bind:value={input}
    placeholder="Symbol (e.g. AAPL)"
    disabled={validating}
    autocomplete="off"
    autocapitalize="characters"
    spellcheck="false"
  />
  <button type="submit" disabled={validating || !input.trim()}>
    {#if validating}…{:else}+ Add{/if}
  </button>
</form>

<style>
  .ticker-search {
    display: flex;
    gap: 8px;
  }

  input {
    padding: 7px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-size: 14px;
    width: 160px;
    transition: border-color 0.15s;
  }

  input:focus {
    outline: none;
    border-color: var(--accent);
  }

  input::placeholder {
    color: var(--text-muted);
  }

  button {
    padding: 7px 14px;
    background: var(--accent);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    transition: opacity 0.15s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
