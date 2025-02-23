<script lang="ts">
  import type { TimePeriod } from '../lib';
  import { fly } from 'svelte/transition';
  import { selectedTimePeriod } from '../stores/sketch';

  function onPeriodChange(period: TimePeriod | null): void {
    $selectedTimePeriod = period;
  }

  console.log('selectedTimePeriod >>', $selectedTimePeriod);

  let isOpen = false;

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-2-months', label: 'Last 2 Months' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' }
  ];

  function handleSelect(period: TimePeriod | null) {
    onPeriodChange(period);
    isOpen = false;
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown relative w-full">
  <button
    on:click={toggleDropdown}
    class="w-full cursor-pointer rounded-lg border mb-3 border-neutral-300 bg-white px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
  >
    <div class="flex items-center justify-between">
      <span>
        {$selectedTimePeriod
          ? timePeriods.find((p) => p.value === $selectedTimePeriod)?.label
          : 'Filter by Time'}
      </span>
      <svg
        class="h-4 w-4 transform transition-transform {isOpen ? 'rotate-180' : ''}"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </button>

  {#if isOpen}
    <div
      class="absolute left-0 right-0 mt-1 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
      transition:fly={{ y: -10, duration: 200 }}
    >
      <button
        class="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        on:click={() => handleSelect(null)}
      >
        <span class="flex-grow">All Time</span>
        {#if !selectedTimePeriod}
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        {/if}
      </button>

      {#each timePeriods as period}
        <button
          class="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          on:click={() => handleSelect(period.value)}
        >
          <span class="flex-grow">{period.label}</span>
          {#if $selectedTimePeriod === period.value}
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
