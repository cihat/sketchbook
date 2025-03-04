<script lang="ts">
  import { onMount } from 'svelte';
  import { pwaInfo } from 'virtual:pwa-info';
  import '../app.css';
  import { browser } from '$app/environment';
  import InstallPrompt from '../components/InstallPrompt.svelte';
  import PwaStatus from '../components/PwaStatus.svelte';
  
  let { children } = $props();
  let needRefresh = $state(false);
  let offlineReady = $state(false);
  let updateSW = $state(() => Promise.resolve());
  
  onMount(async () => {
    if (browser && pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register');
      
      updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          needRefresh = true;
        },
        onOfflineReady() {
          offlineReady = true;
        }
      });
    }
  });
  </script>
  
  {@render children()}
  <InstallPrompt />
  <PwaStatus {needRefresh} {offlineReady} updateServiceWorker={updateSW} />
