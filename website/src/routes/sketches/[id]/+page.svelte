<script lang="ts">
  import { page } from '$app/stores';
  import { repoUrl } from '$lib/constants';
  import type { Sketch } from '@/lib';
  import SketchViewer from '@/components/SketchViewer.svelte';
  import * as Button from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import SketchReadmeViewer from '@/components/SketchReadmeViewer.svelte';
    import { onMount } from 'svelte';

  let sketch: Sketch | null = null;
  let loading = true;
  let error: string | null = null;

  // Get the sketch ID from the route params
  $: sketchId = parseInt($page.params.id);

  // $: if (sketchId) {
  //   fetchSketch(sketchId);
  // }

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

  onMount(() => {
    if (sketchId) {
      fetchSketch(sketchId);
    }
  });
</script>

<svelte:head>
  <title>{sketch ? sketch.name : 'Sketch Details'} | Sketchbook</title>
</svelte:head>

<SketchReadmeViewer
  title={sketch ? sketch.name : 'Sketch Details'}
  subtitle="Sketch View"
  lastUpdated={sketch ? new Date(sketch.date).toLocaleDateString() : ''}
  {loading}
  {error}
  backButton={true}
>
  <div slot="actions">
    {#if sketch}
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
    {/if}
  </div>

  {#if sketch}
    <div>
      <Badge variant="secondary" class="mb-2">
        {sketch.category}
      </Badge>

      {#if sketch.notes}
        <p class="text-muted-foreground mb-6">{sketch.notes}</p>
      {/if}

      <SketchViewer {sketch} />
    </div>
  {/if}
</SketchReadmeViewer>
