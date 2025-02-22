<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	// Import utility functions and hooks
	import { type Project, getEmoji, updateURL, filterProjects } from '../lib';
	import { useProjects, useDarkMode, useURLParams } from '../lib/hooks';

	let projects: Project[] = [];
	let allProjects: Project[] = [];
	let loading: boolean = true;
	let error: string | null = null;

	let isDarkMode: boolean = false;

	let categories: string[] = [];
	let selectedCategory: string | null = null;

	let searchQuery: string = '';

	let sortOrder: 'oldest' | 'newest' = 'oldest';

	// Setup hooks
	const { loadProjects } = useProjects();
	const { setupDarkMode } = useDarkMode();
	const { getURLCategory } = useURLParams();

	function filterByCategory(category: string): void {
		selectedCategory = category;
		updateURL(selectedCategory);
		applyFilters();
	}

	function handleSearch(): void {
		applyFilters();
	}

	function toggleSortOrder(): void {
		sortOrder = sortOrder === 'oldest' ? 'newest' : 'oldest';
		applyFilters();
	}

	function applyFilters(): void {
		projects = filterProjects(allProjects, selectedCategory, searchQuery, sortOrder);
	}

	function resetFilters(): void {
		selectedCategory = null;
		searchQuery = '';
		updateURL(selectedCategory);
		applyFilters();
	}

	onMount(async () => {
		const projectsData = await loadProjects();

		if (projectsData.error) {
			error = projectsData.error;
		} else {
			allProjects = projectsData.allProjects ?? [];
			categories = projectsData.categories ?? [];

			selectedCategory = getURLCategory(categories);

			applyFilters();
		}

		loading = false;
		isDarkMode = setupDarkMode();
	});
</script>

<svelte:head>
	<title>Sketchbook</title>
	<meta name="description" content="Tracking my sketches and experiments" />
</svelte:head>

<div class="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
	<div class="container mx-auto max-w-6xl p-6">
		<header class="mb-8">
			<h1 class="mb-2 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
				Sketchbook
			</h1>
			<p class="text-neutral-500 dark:text-neutral-400">
				Projects, approaches, and ideas I've tried and learned from
			</p>
		</header>
		<div class="flex flex-col gap-6 md:flex-row">
			<div class="w-full md:sticky md:top-6 md:w-1/3 md:self-start">
				<div class="mb-6">
					<div class="relative mb-3 w-full">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
						>
							<svg
								class="h-4 w-4 text-neutral-500 dark:text-neutral-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="search"
							bind:value={searchQuery}
							on:input={handleSearch}
							placeholder="Search sketch..."
							class="w-full rounded-lg border border-neutral-300 bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-400"
						/>
					</div>
					<button
						on:click={toggleSortOrder}
						class="flex w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
						title="Toggle sort order"
					>
						{#if sortOrder === 'oldest'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
								/>
							</svg>
							<span class="text-sm">Oldest First</span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
								/>
							</svg>
							<span class="text-sm">Newest First</span>
						{/if}
					</button>
				</div>
				<div
					class="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
				>
					<h3 class="mb-3 text-lg font-medium">Categories</h3>
					<div class="flex flex-wrap gap-2 md:flex-col">
						<button
							class="rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
              {selectedCategory === null
								? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
								: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'}"
							on:click={resetFilters}
						>
							All Categories
						</button>

						{#each categories as category}
							<button
								class="cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
                {selectedCategory === category
									? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900'
									: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700'}"
								on:click={() => filterByCategory(category)}
							>
								{getEmoji(category)}
								{category}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="w-full md:w-2/3">
				<div
					class="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div class="p-6">
						<h2 class="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
							{#if selectedCategory}
								{getEmoji(selectedCategory)} {selectedCategory} Projects
							{:else}
								My Sketches
							{/if}
							{#if searchQuery.trim() !== ''}
								<span class="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
									Search: "{searchQuery}"
								</span>
							{/if}
							<span class="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
								({projects.length} projects)
							</span>
						</h2>
						{#if loading}
							<div class="py-8 text-center">
								<div
									class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-800 dark:border-neutral-200"
								></div>
								<p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading projects...</p>
							</div>
						{:else if error}
							<div class="py-8 text-center text-red-500 dark:text-red-400">
								<p>Error: {error}</p>
								<p class="mt-2 text-sm">
									Please make sure your projects.json file is in the public folder
								</p>
							</div>
						{:else if projects.length === 0}
							<div class="cursor-pointer px-4 py-12 text-center">
								<svg
									class="mx-auto mb-4 h-12 w-12 text-neutral-400 dark:text-neutral-600"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 class="mb-1 text-lg font-medium text-neutral-700 dark:text-neutral-300">
									No projects found
								</h3>
								<p class="mb-4 text-neutral-500 dark:text-neutral-400">
									{#if selectedCategory}
										No projects in the "{selectedCategory}" category
									{:else if searchQuery.trim() !== ''}
										No projects match your search for "{searchQuery}"
									{:else}
										No projects have been added yet
									{/if}
								</p>
								{#if selectedCategory || searchQuery.trim() !== ''}
									<button
										on:click={resetFilters}
										class="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
									>
										Reset filters
									</button>
								{/if}
							</div>
						{:else}
							<ul class="space-y-4">
								{#each projects as project (project.id)}
									<li
										in:fly={{ y: 20, duration: 300 }}
										out:fade
										class="relative rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
									>
										<div class="absolute top-3 right-4">
											<span
												class="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
											>
												{getEmoji(project.category)}
												{project.category}
											</span>
										</div>

										<div class="flex items-start pr-28">
											<div class="flex-1">
												{#if project.link && project.completed}
													<a
														href={project.link}
														target="_blank"
														rel="noopener noreferrer"
														class="font-medium text-neutral-900 hover:underline dark:text-neutral-50 {project.completed
															? 'line-through opacity-60'
															: ''}"
													>
														{project.name}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="ml-1 inline-block h-4 w-4 opacity-70"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path
																d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
															/>
															<path
																d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
															/>
														</svg>
													</a>
												{:else}
													<h3
														class="font-medium text-neutral-900 dark:text-neutral-50 {project.completed
															? 'line-through opacity-60'
															: ''}"
													>
														{project.name}
													</h3>
												{/if}
												{#if project.notes}
													<p
														class="mt-1 text-sm text-neutral-500 dark:text-neutral-400 {project.completed
															? 'opacity-60'
															: ''}"
													>
														{project.notes}
													</p>
												{/if}
												<div class="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
													Added: {new Date(project.date).toLocaleDateString()}
												</div>
											</div>
										</div>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<footer class="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
			<p>Cihat Salik © 2025</p>
		</footer>
	</div>
</div>

<style>
	:global(html) {
		font-family:
			'Inter',
			sans-serif,
			-apple-system,
			BlinkMacSystemFont,
			'Inter',
			'SF Pro Text',
			'SF Pro',
			'Segoe UI',
			Roboto,
			system-ui,
			sans-serif;
		/* -webkit-font-smoothing: antialiased; */
	}
</style>
