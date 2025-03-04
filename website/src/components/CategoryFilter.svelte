<script lang="ts">
  import { categories, selectedCategory } from '../stores/sketch';
  import { getEmoji, updateURL } from '../lib';
  import { onMount } from 'svelte';

  let isOpen = false;
  let dropdownRef: HTMLDivElement;

  function resetFilters(): void {
    $selectedCategory = null;
    updateURL(null);
    isOpen = false;
  }

  function filterByCategory(category: string): void {
    $selectedCategory = category;
    updateURL(category);
    isOpen = false;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<!-- Dropdown button -->
<div class="relative mb-2" bind:this={dropdownRef}>
  <button
    class="flex w-full items-center justify-between rounded-lg bg-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
    on:click={() => (isOpen = !isOpen)}
  >
    {#if $selectedCategory === null}
      <span>All Categories</span>
    {:else}
      <span>{getEmoji($selectedCategory)} {$selectedCategory}</span>
    {/if}
    <svg
      class="ml-2 h-4 w-4 transition-transform {isOpen ? 'rotate-180' : ''}"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
    >
      <button
        class="w-full rounded-t-lg px-3 py-2 text-left text-sm font-medium transition-colors {$selectedCategory ===
        null
          ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
          : 'bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'}"
        on:click={resetFilters}
      >
        All Categories
      </button>

      {#each $categories as category}
        <button
          class="w-full px-3 py-2 text-left text-sm font-medium transition-colors {$selectedCategory ===
          category
            ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
            : 'bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'} {category ===
          $categories[$categories.length - 1]
            ? 'rounded-b-lg'
            : ''}"
          on:click={() => filterByCategory(category)}
        >
          {getEmoji(category)}
          {category}
        </button>
      {/each}
    </div>
  {/if}
</div>
