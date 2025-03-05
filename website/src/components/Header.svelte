<script lang="ts">
  import { Button } from '@/lib/components/ui/button';
  import { House, SquarePen } from 'lucide-svelte';
</script>

<header class="mb-4 flex flex-col justify-between sm:flex-row md:mb-8">
  <div class="mb-4 sm:mb-0">
    <h1 class="mb-2 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
      Sketchbook
    </h1>
    <p class="text-neutral-500 dark:text-neutral-400">
      Sketches, approaches, and ideas I've tried and learned from
    </p>
  </div>
  <div>
    <Button size="sm" variant="ghost">
      <a href="/">
        <House />
      </a>
    </Button>
    <Button size="sm" variant="ghost">
      <a href="/ideas/">
        <SquarePen />
      </a>
    </Button>
  </div>
</header>
