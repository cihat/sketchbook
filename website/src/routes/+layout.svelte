<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';
  import Header from '@/components/Header.svelte';

  let { children } = $props();

  inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="bg-background text-foreground min-h-screen">
  <div class="container mx-auto max-w-6xl px-2 py-4 md:p-6">
    <Header />
    {@render children()}
  </div>
</div>
