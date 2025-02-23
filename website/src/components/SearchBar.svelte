<script lang="ts">
  import { searchQuery } from '../stores/sketch';
</script>

<div class="relative mb-3 w-full">
  <div class="pointer-events-none absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3">
    <svg
      class="h-4 w-4 text-neutral-500 dark:text-neutral-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
  <input
    type="search"
    bind:value={$searchQuery}
    placeholder="Search sketch..."
    class="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 focus:ring-2 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-400"
  />
</div>
