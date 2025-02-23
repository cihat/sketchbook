<script lang="ts">
  import { categories, selectedCategory } from '../stores/sketch';
  import { getEmoji, updateURL } from '../lib';

  function resetFilters(): void {
    $selectedCategory = null;
    updateURL(null);
  }

  function filterByCategory(category: string): void {
    $selectedCategory = category;
    updateURL(category);
  }
</script>

<div
  class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
>
  <h3 class="mb-3 text-lg font-medium">Categories</h3>
  <div class="flex flex-wrap gap-2 md:flex-col">
    <button
      class="rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
      {$selectedCategory === null
        ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
        : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'}"
      on:click={resetFilters}
    >
      All Categories
    </button>

    {#each $categories as category}
      <button
        class="cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
        {$selectedCategory === category
          ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
          : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'}"
        on:click={() => filterByCategory(category)}
      >
        {getEmoji(category)}
        {category}
      </button>
    {/each}
  </div>
</div>
