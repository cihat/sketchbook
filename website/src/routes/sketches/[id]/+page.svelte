<script lang="ts">
  import { page } from '$app/stores';
  import { repoUrl } from '$lib/constants';
  import type { Sketch } from '@/lib';
  import SketchViewer from '@/components/SketchViewer.svelte';
  import * as Button from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Loader2 } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let sketch: Sketch | null = null;
  let loading = true;
  let error: string | null = null;

  // Get the sketch ID from the route params
  $: sketchId = parseInt($page.params.id);

  $: if (sketchId) {
    fetchSketch(sketchId);
  }

  async function fetchSketch(id: number) {
    loading = true;
    error = null;

    try {
      const response = await fetch('/sketches.json');
      if (!response.ok) {
        throw new Error('Failed to load sketches data');
      }
      const sketches = await response.json();
      // Find the sketch with the matching ID
      sketch = sketches.find((s) => s.id === id) || null;

      if (!sketch) {
        error = `Sketch with ID ${id} not found`;
      }
    } catch (err) {
      console.error('Error fetching sketch:', err);
      error = 'Failed to load sketch details';
    } finally {
      loading = false;
    }
  }

  // onMount(() => {
  //   if (sketchId) {
  //     fetchSketch(sketchId);
  //   }
  // });
</script>

<svelte:head>
  <title>{sketch ? sketch.name : 'Sketch Details'} | Sketchbook</title>
</svelte:head>

<section class="container px-4 py-8">
  <nav class="mb-6">
    <Button.Root variant="ghost" class="flex h-auto items-center p-0" href="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mr-1 h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Back to all sketches
    </Button.Root>
  </nav>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <Loader2 class="mr-3 h-8 w-8 animate-spin" />
      <span class="text-muted-foreground">Loading sketch details...</span>
    </div>
  {:else if error}
    <div class="bg-destructive/15 text-destructive border-destructive/50 rounded-md border p-3">
      <p>{error}</p>
    </div>
  {:else if sketch}
    <Card>
      <CardContent class="p-6">
        <div class="mb-4 flex items-start justify-between">
          <div>
            <Badge variant="secondary" class="mb-2">
              {sketch.category}
            </Badge>
            <h1 class="text-2xl font-bold">{sketch.name}</h1>
          </div>
          <Button.Root variant="ghost" size="icon">
            <a
              href={repoUrl + sketch.link}
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground"
            >
              <span class="sr-only">View on GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </Button.Root>
        </div>

        {#if sketch.notes}
          <p class="text-muted-foreground mb-6">{sketch.notes}</p>
        {/if}

        <div class="text-muted-foreground mb-6 text-sm">
          Added: {new Date(sketch.date).toLocaleDateString()}
        </div>

        <SketchViewer {sketch} />
      </CardContent>
    </Card>
  {/if}
</section>
