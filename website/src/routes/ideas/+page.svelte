<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Alert from '$lib/components/ui/alert';

	let content = '';
	let loading = true;
	let error = null;
	let theme = 'system';

	// Tema değiştirme fonksiyonu
	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(theme);
		localStorage.setItem('theme', theme);
	}

	// Tema uygulama fonksiyonu
	function applyTheme(newTheme) {
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else if (newTheme === 'light') {
			document.documentElement.classList.remove('dark');
		} else if (newTheme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			if (systemTheme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	onMount(async () => {
		// Tema tercihini localStorage'dan al (yoksa sistem temasını kullan)
		const savedTheme = localStorage.getItem('theme') || 'system';
		theme = savedTheme;
		
		// Tema tercihi system ise, sistem temasını kontrol et
		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			theme = systemTheme;
		}
		
		// Temayı uygula
		applyTheme(theme);
		
		// Sistem tema değişikliklerini dinle
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', (e) => {
			if (theme === 'system') {
				applyTheme(e.matches ? 'dark' : 'light');
			}
		});

		try {
			const response = await fetch('/README.md');

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const markdown = await response.text();

			// Markdown'ı HTML'e dönüştürme
			content = marked(markdown);
			loading = false;
		} catch (e) {
			error = e.message;
			loading = false;
		}
	});
</script>

<div class="container mx-auto px-4 py-10">
	<Card class="mx-auto w-full max-w-4xl">
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Ideas</CardTitle>
				<Button 
					variant="outline" 
					size="icon" 
					on:click={toggleTheme} 
					class="rounded-full h-9 w-9 p-0"
				>
					{#if theme === 'dark'}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
					{/if}
					<span class="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
				</Button>
			</div>
			<CardDescription class="flex items-center space-x-2 justify-between">
				<p>README.md içeriği</p>
				<div class="text-muted-foreground text-sm">Last updated: 03/05/2025</div>
				<Button variant="outline" size="sm" on:click={() => window.history.back()}>Geri</Button>
			</CardDescription>
		</CardHeader>

		<CardContent>
			{#if loading}
				<div class="space-y-2">
					<Skeleton class="h-6 w-2/3" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="mt-4 h-6 w-1/2" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
				</div>
			{:else if error}
				<Alert.Root variant="destructive">
					<Alert.Icon />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{:else}
				<div class="prose dark:prose-invert max-w-none">
					{@html content}
				</div>
			{/if}
		</CardContent>

		<CardFooter class="flex justify-between text-sm text-muted-foreground">
			<div>
				Tema: {theme === 'dark' ? 'Koyu' : 'Açık'} mod
			</div>
		</CardFooter>
	</Card>
</div>

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
    padding-bottom: .3em;
    border-bottom: 1px solid hsl(var(--border));
	}

	:global(.prose h2) {
		font-size: 1.5rem;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.025em;
    padding-bottom: .3em;
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
