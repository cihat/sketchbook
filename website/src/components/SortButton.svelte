<script lang="ts">
  import { sortOrder } from '../stores/sketch';

  function toggleSortOrder() {
    $sortOrder = $sortOrder === 'oldest' ? 'newest' : 'oldest';
  }
</script>

<button
  on:click={toggleSortOrder}
  class="flex w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
  title="Toggle sort order"
>
  {#if $sortOrder === 'oldest'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="mr-1 h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    </svg>
    <span class="text-sm">Oldest First</span>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="mr-1 h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
      />
    </svg>
    <span class="text-sm">Newest First</span>
  {/if}
</button>
