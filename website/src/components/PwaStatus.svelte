<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let needRefresh = false;
  export let offlineReady = false;
  export let updateServiceWorker = () => Promise.resolve();
  
  let dismissed = false;
  
  function close() {
    dismissed = true;
    offlineReady = false;
    needRefresh = false;
  }
  
  function update() {
    updateServiceWorker(true);
  }
  
  $: show = (offlineReady || needRefresh) && !dismissed;
</script>

{#if show}
  <div class="pwa-toast" role="alert">
    <div class="message">
      {#if offlineReady}
        <span>App ready to work offline</span>
      {:else}
        <span>New content available, click on reload button to update.</span>
      {/if}
    </div>
    
    <div class="buttons">
      {#if needRefresh}
        <button on:click={update}>Reload</button>
      {/if}
      <button on:click={close}>Close</button>
    </div>
  </div>
{/if}

<style>
  .pwa-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    background-color: white;
  }
  
  .pwa-toast .message {
    margin-bottom: 8px;
  }
  
  .pwa-toast .buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .pwa-toast button {
    border: 1px solid #8885;
    outline: none;
    margin: 0;
    padding: 8px 10px;
    border-radius: 2px;
    cursor: pointer;
  }
  
  .pwa-toast button:hover {
    background-color: #f2f2f2;
  }
</style>
