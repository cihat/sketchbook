<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import SketchReadmeViewer from '@/components/SketchReadmeViewer.svelte';

  let content = '';
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('/README.md');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const markdown = await response.text();

      content = marked(markdown);
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });
</script>

<SketchReadmeViewer
  title="Ideas"
  subtitle="README.md Content"
  lastUpdated="03/05/2025"
  {loading}
  {error}
>
  <div class="prose dark:prose-invert max-w-none">
    {@html content}
  </div>
</SketchReadmeViewer>
