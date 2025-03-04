<!-- components/TimeFilter.svelte -->
<script lang="ts">
  import type { TimePeriod } from '../lib';
  import { selectedTimePeriod } from '../stores/sketch';

  // Import ShadCN components
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Button from '$lib/components/ui/button';
  import { Check, ChevronDown, Clock } from 'lucide-svelte';

  function onPeriodChange(period: TimePeriod | null): void {
    $selectedTimePeriod = period;
  }

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-2-months', label: 'Last 2 Months' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' }
  ];

  $: selectedLabel = $selectedTimePeriod
    ? timePeriods.find((p) => p.value === $selectedTimePeriod)?.label
    : 'Filter by Time';
</script>

<div class="w-full">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button.Root variant="outline" class="w-full justify-between" builders={[builder]}>
        <div class="flex items-center">
          <Clock class="mr-2 h-4 w-4 opacity-70" />
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown class="h-4 w-4 opacity-70" />
      </Button.Root>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Label>Time Period</DropdownMenu.Label>
      <DropdownMenu.Separator />

      <DropdownMenu.Item
        on:click={() => onPeriodChange(null)}
        class="flex items-center justify-between"
      >
        <span>All Time</span>
        {#if $selectedTimePeriod === null}
          <Check class="h-4 w-4" />
        {/if}
      </DropdownMenu.Item>

      <DropdownMenu.Separator />

      {#each timePeriods as period}
        <DropdownMenu.Item
          on:click={() => onPeriodChange(period.value)}
          class="flex items-center justify-between"
        >
          <span>{period.label}</span>
          {#if $selectedTimePeriod === period.value}
            <Check class="h-4 w-4" />
          {/if}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
