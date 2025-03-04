<script lang="ts">
  import { categories, selectedCategory } from '../stores/sketch';
  import { getEmoji, updateURL } from '../lib';

  // Import ShadCN components
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Button from '$lib/components/ui/button';
  import { Check, ChevronDown, Filter } from 'lucide-svelte';

  function resetFilters(): void {
    $selectedCategory = null;
    updateURL(null);
  }

  function filterByCategory(category: string): void {
    $selectedCategory = category;
    updateURL(category);
  }

  $: buttonText =
    $selectedCategory === null
      ? 'All Categories'
      : `${getEmoji($selectedCategory)} ${$selectedCategory}`;
</script>

<div class="mb-1 md:mb-2">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button.Root variant="outline" class="w-full justify-between" builders={[builder]}>
        <span>{buttonText}</span>
        <ChevronDown class="ml-2 h-4 w-4 opacity-70" />
      </Button.Root>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="min-w-[200px]">
      <DropdownMenu.Label>Filter by Category</DropdownMenu.Label>
      <DropdownMenu.Separator />

      <DropdownMenu.Item on:click={resetFilters} class="flex items-center justify-between">
        <span>All Categories</span>
        {#if $selectedCategory === null}
          <Check class="h-4 w-4" />
        {/if}
      </DropdownMenu.Item>

      {#each $categories as category}
        <DropdownMenu.Item
          on:click={() => filterByCategory(category)}
          class="flex items-center justify-between"
        >
          <span>{getEmoji(category)} {category}</span>
          {#if $selectedCategory === category}
            <Check class="h-4 w-4" />
          {/if}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
