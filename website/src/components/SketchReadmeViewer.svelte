<script>
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Alert from '$lib/components/ui/alert';
  import { Loader2 } from 'lucide-svelte';

  /**
   * Props
   */
  export let title = 'Content';
  export let subtitle = '';
  export let lastUpdated = '';
  export let loading = false;
  export let error = null;
  export let backButton = true;

  // Function to handle back button click
  function goBack() {
    window.history.back();
  }
</script>

<div class="prose dark:prose-invert max-w-none">
  {#if backButton}
    <nav class="mb-6">
      <!-- <Button variant="ghost" class="flex h-auto items-center p-0" on:click={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-1 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back
      </Button> -->
    </nav>
  {/if}

  <Card class="mx-auto w-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {#if $$slots.actions}
          <slot name="actions"></slot>
        {/if}
      </div>
      <CardDescription class="flex items-center justify-between space-x-2">
        <p>{subtitle}</p>
        {#if lastUpdated}
          <div class="text-muted-foreground text-sm">Last updated: {lastUpdated}</div>
        {/if}
        {#if backButton}
          <Button variant="outline" size="sm" on:click={goBack}>Back</Button>
        {/if}
      </CardDescription>
    </CardHeader>

    <CardContent>
      {#if loading}
        <div class="flex items-center justify-center py-12">
          <Loader2 class="mr-3 h-8 w-8 animate-spin" />
          <span class="text-muted-foreground">Loading...</span>
        </div>
      {:else if error}
        <Alert.Root variant="destructive">
          <Alert.Icon />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      {:else}
        <slot></slot>
      {/if}
    </CardContent>
  </Card>
</div>
