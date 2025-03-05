<script context="module">
  // Simple markdown to HTML converter
  // For production, use a proper library like marked.js
  function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';

    // Basic sanitization
    const sanitized = markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Process line by line
    return sanitized
      .split('\n')
      .map((line) => {
        // Headings
        if (line.startsWith('# ')) {
          return `<h1>${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
          return `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
          return `<h3>${line.substring(4)}</h3>`;
        }

        // Code blocks (simple)
        else if (line.startsWith('```')) {
          return `<div class="code-block">Code block</div>`;
        }

        // Lists
        else if (line.match(/^[*-] /)) {
          return `<li>${line.substring(2)}</li>`;
        }

        // Empty line to paragraph break
        else if (line.trim() === '') {
          return '<br>';
        }

        // Regular paragraph
        else {
          return `<p>${line}</p>`;
        }
      })
      .join('');
  }
</script>

<script>
  import { repoUrl } from '@/lib/constants';

  import { onMount } from 'svelte';

  // Props
  export let sketch;

  // State
  let readme = '';
  let loading = true;
  let error = null;

  function getRawContentUrl(url) {
    return url
      .replace('https://github.com', 'https://raw.githubusercontent.com')
      .replace('/tree/main/', '/main/')
      .replace('/blob/main/', '/main/');
  }

  // Fetch README when component mounts or sketch changes
  $: if (sketch) {
    fetchReadme(sketch);
  }

  async function fetchReadme(sketchData) {
    if (!sketchData || !sketchData.link) {
      error = 'Invalid sketch information';
      loading = false;
      return;
    }

    try {
      loading = true;
      // Construct the README URL
      const readmeUrl = getRawContentUrl(`${repoUrl}${sketchData.link}/README.md`);

      // Fetch the README content
      const response = await fetch(readmeUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch README: ${response.status}`);
      }

      readme = await response.text();
      loading = false;
      error = null;
    } catch (err) {
      console.error('Error fetching README:', err);
      error = `Failed to load README: ${err.message}`;
      loading = false;
    }
  }

  onMount(() => {
    if (sketch) {
      fetchReadme(sketch);
    }
  });
</script>

<div class="sketch-readme-viewer">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading README...</span>
    </div>
  {:else if error}
    <div class="error">
      {error}
    </div>
  {:else}
    <div class="markdown-content">
      <div class="header">
        <h1>{sketch.name}</h1>
        <a href={repoUrl + sketch.link} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </div>

      <!-- We'll use Svelte's {@html} to render the README with basic sanitization -->
      <!-- Note: In a production app, you should use a proper markdown parser like marked.js -->
      <div class="markdown-body">
        {@html convertMarkdownToHtml(readme)}
      </div>
    </div>
  {/if}
</div>

