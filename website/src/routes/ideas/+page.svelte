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

<style>
  /* Shadcn ile prose (tipografi) stillerini uyumlu hale getirme */
  :global(.prose) {
    --tw-prose-body: hsl(var(--foreground));
    --tw-prose-headings: hsl(var(--foreground));
    --tw-prose-lead: hsl(var(--muted-foreground));
    --tw-prose-links: hsl(var(--primary));
    --tw-prose-bold: hsl(var(--foreground));
    --tw-prose-counters: hsl(var(--muted-foreground));
    --tw-prose-bullets: hsl(var(--muted-foreground));
    --tw-prose-hr: hsl(var(--border));
    --tw-prose-quotes: hsl(var(--foreground));
    --tw-prose-quote-borders: hsl(var(--border));
    --tw-prose-captions: hsl(var(--muted-foreground));
    --tw-prose-code: hsl(var(--foreground));
    --tw-prose-pre-code: hsl(var(--secondary-foreground));
    --tw-prose-pre-bg: hsl(var(--secondary));
    --tw-prose-th-borders: hsl(var(--border));
    --tw-prose-td-borders: hsl(var(--border));
  }

  :global(.prose.dark) {
    --tw-prose-body: hsl(var(--foreground));
    --tw-prose-headings: hsl(var(--foreground));
    --tw-prose-lead: hsl(var(--muted-foreground));
    --tw-prose-links: hsl(var(--primary));
    --tw-prose-bold: hsl(var(--foreground));
    --tw-prose-counters: hsl(var(--muted-foreground));
    --tw-prose-bullets: hsl(var(--muted-foreground));
    --tw-prose-hr: hsl(var(--border));
    --tw-prose-quotes: hsl(var(--foreground));
    --tw-prose-quote-borders: hsl(var(--border));
    --tw-prose-captions: hsl(var(--muted-foreground));
    --tw-prose-code: hsl(var(--foreground));
    --tw-prose-pre-code: hsl(var(--secondary-foreground));
    --tw-prose-pre-bg: hsl(var(--secondary));
    --tw-prose-th-borders: hsl(var(--border));
    --tw-prose-td-borders: hsl(var(--border));
  }

  /* Markdown özel stilleri */
  :global(.prose h1) {
    font-size: 2rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.025em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid hsl(var(--border));
  }

  :global(.prose h2) {
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.025em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid hsl(var(--border));
  }

  :global(.prose h3) {
    font-size: 1.25rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.4;
  }

  :global(.prose p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.65;
  }

  :global(.prose ul) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 1.625em;
  }

  :global(.prose li) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  :global(.prose a) {
    text-decoration: underline;
    text-decoration-color: hsl(var(--primary) / 0.4);
    text-underline-offset: 2px;
    font-weight: 500;
  }

  :global(.prose a:hover) {
    text-decoration-color: hsl(var(--primary));
  }

  :global(.prose blockquote) {
    border-left: 2px solid hsl(var(--border));
    padding-left: 1rem;
    font-style: italic;
    color: hsl(var(--muted-foreground));
  }

  :global(.prose pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    background-color: hsl(var(--secondary));
    font-size: 0.875rem;
  }

  :global(.prose code) {
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
    font-size: 0.875em;
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    background-color: hsl(var(--secondary) / 0.5);
  }

  :global(.prose pre code) {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    color: hsl(var(--secondary-foreground));
  }

  :global(.prose table) {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  :global(.prose th) {
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid hsl(var(--border));
  }

  :global(.prose td) {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid hsl(var(--border));
  }
</style>
