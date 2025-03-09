<script context="module">
  // Import the marked library
  import { marked } from 'marked';
  
  // Configure marked options (optional)
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    sanitize: false, // Don't sanitize HTML (we'll handle this separately)
    highlight: function (code, lang) {
      // You can add syntax highlighting here if needed
      return code;
    }
  });
  
  // Function to sanitize HTML to prevent XSS
  function sanitizeHtml(html) {
    // Basic sanitization - for production, consider using a dedicated library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '');
  }
  
  // Convert markdown to HTML
  function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';
    
    try {
      // Use marked to convert markdown to HTML
      const html = marked.parse(markdown);
      
      // Sanitize the output HTML
      return sanitizeHtml(html);
    } catch (error) {
      console.error('Error converting markdown:', error);
      return `<p>Error rendering markdown: ${error.message}</p>`;
    }
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
    <div class="header">
      <h1>{sketch.name}</h1>
      <a href={repoUrl + sketch.link} target="_blank" rel="noopener noreferrer"> View on GitHub </a>
    </div>
    <div class="markdown-content">
      {@html convertMarkdownToHtml(readme)}
    </div>
  {/if}
</div>

<style>
  .sketch-readme-viewer {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #666;
  }
  
  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    padding: 20px;
    color: #e74c3c;
    border-left: 4px solid #e74c3c;
    background-color: #fde9e8;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
    /* border-bottom: 1px solid #eee; */
  }
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  .markdown-content :global(p) {
    margin-bottom: 1em;
  }
  
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    padding-left: 2em;
    margin-bottom: 1em;
  }
  
  .markdown-content :global(code) {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
  
  .markdown-content :global(pre) {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin-bottom: 1em;
  }
  
  .markdown-content :global(blockquote) {
    padding-left: 1em;
    margin-left: 0;
    border-left: 4px solid #eee;
    color: #666;
  }
  
  .markdown-content :global(img) {
    max-width: 100%;
    height: auto;
  }
  
  .markdown-content :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  
  .markdown-content :global(th),
  .markdown-content :global(td) {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .markdown-content :global(th) {
    background-color: #f5f5f5;
  }
</style>
