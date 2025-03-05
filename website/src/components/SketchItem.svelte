<script lang="ts">
  import { repoUrl } from '$lib/constants';
  import { type Sketch, getEmoji } from '../lib';

  export let sketch: Sketch;
</script>

<div class="absolute right-4 top-3">
  <span
    class="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
  >
    {getEmoji(sketch.category)}
    {sketch.category}
  </span>
</div>

<div class="flex items-start pr-2 sm:pr-28">
  <div class="flex-1">
    {#if sketch.link}
      <a
        href={repoUrl + sketch.link}
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
      >
        {sketch.name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mb-2 ml-1 inline-block h-5 w-5 opacity-70"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
          />
          <path
            d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
          />
        </svg>
      </a>
    {:else}
      <h3
        class="font-medium text-neutral-900 dark:text-neutral-50 {sketch.completed
          ? 'line-through opacity-60'
          : ''}"
      >
        {sketch.name}
      </h3>
    {/if}
    {#if sketch.notes}
      <p
        class="mt-1 text-sm text-neutral-500 dark:text-neutral-400 {sketch.completed
          ? 'opacity-60'
          : ''}"
      >
        {sketch.notes}
      </p>
    {/if}
    <div class="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
      Added: {new Date(sketch.date).toLocaleDateString()}
    </div>
  </div>
</div>
