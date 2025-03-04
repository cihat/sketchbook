<!-- components/SearchBar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as Input from "$lib/components/ui/input";
  import { Search } from "lucide-svelte";
  import { searchQuery } from '../stores/sketch';

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery.set(target.value);
    dispatch('search', target.value);
  }
</script>

<div class="relative mb-1 md:mb-2">
  <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input.Root 
    type="text" 
    placeholder="Search sketches..." 
    class="pl-8"
    value={$searchQuery}
    on:input={handleInput}
  />
</div>
