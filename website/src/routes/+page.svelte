<!-- routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import SortButton from '../components/SortButton.svelte';
  import CategoryFilter from '../components/CategoryFilter.svelte';
  import TimeFilter from '../components/TimeFilter.svelte';
  import SketchList from '../components/SketchList.svelte';
  import Footer from '../components/Footer.svelte';
  import { allSketches, loading, categories, error, selectedCategory } from '../stores/sketch';
  import { darkMode } from '../stores/darkMode';
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

    darkMode.setup();
  });
</script>

<svelte:head>
  <title>Sketchbook</title>
  <meta name="description" content="Tracking my sketches and experiments" />
</svelte:head>

<div class="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
  <div class="container mx-auto max-w-6xl p-6">
    <Header />

    <div class="flex flex-col gap-6 md:flex-row">
      <div class="w-full md:sticky md:top-6 md:w-1/3 md:self-start">
        <div class="mb-6">
          <SearchBar />
          <SortButton />
        </div>
        <TimeFilter />
        <CategoryFilter />
      </div>

      <div class="w-full md:w-2/3">
        <SketchList />
      </div>
    </div>

    <Footer />
  </div>
</div>

<style>
  :global(html) {
    font-family:
      'Inter',
      sans-serif,
      -apple-system,
      BlinkMacSystemFont,
      'Inter',
      'SF Pro Text',
      'SF Pro',
      'Segoe UI',
      Roboto,
      system-ui,
      sans-serif;
    background-color: #fafafa;
  }

  :global(html.dark) {
    background-color: #0a0a0a;
  }

  :global(body) {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow-x: hidden;
    position: relative;
    background-color: inherit;
  }

  :global(#app) {
    background-color: inherit;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @supports (-webkit-touch-callout: none) {
    :global(body) {
      min-height: -webkit-fill-available;
    }
  }
</style>
