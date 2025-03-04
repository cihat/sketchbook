<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import {
    groupedSketches,
    loading,
    error,
    selectedCategory,
    searchQuery,
    selectedTimePeriod
  } from '../stores/sketch';
  import { getEmoji, updateURL } from '../lib';
  import SketchItem from './SketchItem.svelte';

  function resetFilters(): void {
    $selectedCategory = null;
    $searchQuery = '';
    $selectedTimePeriod = null;
    updateURL(null);
  }
</script>

<div
  class="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
>
  <div class="p-2 md:p-4">
    <h2 class="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
      {#if $selectedCategory}
        {getEmoji($selectedCategory)} {$selectedCategory} Sketches
      {:else}
        My Sketches
      {/if}
      {#if $searchQuery.trim() !== ''}
        <span class="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
          Search: "{$searchQuery}"
        </span>
      {/if}
      <span class="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
        ({Object.values($groupedSketches).flat().length} sketches)
      </span>
    </h2>

    {#if $loading}
      <div class="py-8 text-center">
        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-800 dark:border-neutral-200"
        ></div>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading sketches...</p>
      </div>
    {:else if $error}
      <div class="py-8 text-center text-red-500 dark:text-red-400">
        <p>Error: {$error}</p>
        <p class="mt-2 text-sm">Please make sure your sketches.json file is in the public folder</p>
      </div>
    {:else if Object.keys($groupedSketches).length === 0}
      <div class="cursor-pointer px-4 py-12 text-center">
        <svg
          class="mx-auto mb-4 h-12 w-12 text-neutral-400 dark:text-neutral-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mb-1 text-lg font-medium text-neutral-700 dark:text-neutral-300">
          No sketches found
        </h3>
        <p class="mb-4 text-neutral-500 dark:text-neutral-400">
          {#if $selectedCategory}
            No sketches in the "{$selectedCategory}" category
          {:else if $searchQuery.trim() !== ''}
            No sketches match your search for "{$searchQuery}"
          {:else}
            No sketches have been added yet
          {/if}
        </p>
        {#if $selectedCategory || $searchQuery.trim() !== '' || selectedTimePeriod}
          <button
            on:click={resetFilters}
            class="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            Reset filters
          </button>
        {/if}
      </div>
    {:else}
      <div class="space-y-8">
        {#each Object.entries($groupedSketches) as [weekKey, weekSketches] (weekKey)}
          <div class="mb-6">
            <h3 class="mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-300">
              {weekKey}
              <span class="ml-2 text-sm font-normal text-neutral-500">
                ({weekSketches.length} sketches)
              </span>
            </h3>
            <ul class="space-y-4">
              {#each weekSketches as sketch (sketch.id)}
                <li
                  in:fly={{ y: 20, duration: 300 }}
                  out:fade
                  class="relative rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                >
                  <SketchItem {sketch} />
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
