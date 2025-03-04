<script lang="ts">
  import { onMount } from 'svelte';

  // Import ShadCN components
  import * as Card from '$lib/components/ui/card';
  import * as Separator from '$lib/components/ui/separator';
  import * as Skeleton from '$lib/components/ui/skeleton';
  import * as Alert from '$lib/components/ui/alert';

  // Import custom components that we'll rewrite
  import Header from '../components/Header.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import SortButton from '../components/SortButton.svelte';
  import CategoryFilter from '../components/CategoryFilter.svelte';
  import TimeFilter from '../components/TimeFilter.svelte';
  import SketchList from '../components/SketchList.svelte';
  import Footer from '../components/Footer.svelte';

  import { allSketches, loading, categories, error, selectedCategory } from '../stores/sketch';
  import type { Sketch } from '$lib';
  import { urlParamsHelper } from '$lib/urlParams';

  onMount(async () => {
    try {
      const response = await fetch('/sketches.json');
      if (!response.ok) {
        throw new Error('Failed to load sketches data');
      }
      const sketches = await response.json();
      allSketches.set(sketches);
      const categorySet = new Set(sketches.map((sketch: Sketch) => sketch.category));
      const allCategories = Array.from(categorySet) as string[];
      categories.set(allCategories);
      selectedCategory.set(urlParamsHelper.getURLCategory(allCategories));
      loading.set(false);
    } catch (err) {
      console.error('Error loading sketches:', err);
      error.set(err instanceof Error ? err.message : 'Unknown error');
      loading.set(false);
    }
  });
</script>

<svelte:head>
  <title>Sketchbook</title>
  <meta name="description" content="Tracking my sketches and experiments" />
</svelte:head>

<div class="bg-background text-foreground min-h-screen">
  <div class="container mx-auto max-w-6xl p-6">
    <Header />

    <div class="grid gap-6 md:grid-cols-3">
      <!-- Sidebar with filters -->
      <div class="space-y-6 md:sticky md:top-6 md:self-start">
        <Card.Root>
          <Card.Content>
            <SearchBar />
            <CategoryFilter />
            <TimeFilter />
          </Card.Content>
        </Card.Root>
      </div>

      <!-- Main content area -->
      <div class="md:col-span-2">
        {#if $loading}
          <div class="space-y-4">
            <Skeleton.Root class="h-12 w-full" />
            <Skeleton.Root class="h-64 w-full" />
            <Skeleton.Root class="h-64 w-full" />
          </div>
        {:else if $error}
          <Alert.Root variant="destructive">
            <Alert.Title>Error loading sketches</Alert.Title>
            <Alert.Description>{$error}</Alert.Description>
          </Alert.Root>
        {:else}
          <SketchList />
        {/if}
      </div>
    </div>

    <Separator.Root class="my-8" />

    <Footer />
  </div>
</div>
