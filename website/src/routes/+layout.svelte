<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';
  import Header from '@/components/Header.svelte';

  let { children } = $props();

  injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<div class="bg-background text-foreground min-h-screen">
  <div class="container mx-auto max-w-4xl px-2 py-4 md:p-6">
    <Header />
    {@render children()}
  </div>
</div>
