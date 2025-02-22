<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	// Project data model with link property
	let projects = [
		{
			id: 1,
			name: 'UI Design System',
			completed: false,
			notes: 'Creating component library with Sketch and Figma',
			link: 'https://github.com/username/design-system'
		},
		{
			id: 2,
			name: 'Responsive Dashboard',
			completed: true,
			notes: 'Data visualization for admin panel',
			link: ''
		},
		{
			id: 3,
			name: 'Mobile App Prototype',
			completed: false,
			notes: 'Design and user flow for e-commerce app',
			link: 'https://github.com/username/mobile-prototype'
		},
		{
			id: 1,
			name: 'UI Design System',
			completed: false,
			notes: 'Creating component library with Sketch and Figma',
			link: 'https://github.com/username/design-system'
		},
		{
			id: 2,
			name: 'Responsive Dashboard',
			completed: true,
			notes: 'Data visualization for admin panel',
			link: ''
		},
		{
			id: 3,
			name: 'Mobile App Prototype',
			completed: false,
			notes: 'Design and user flow for e-commerce app',
			link: 'https://github.com/username/mobile-prototype'
		},
		{
			id: 1,
			name: 'UI Design System',
			completed: false,
			notes: 'Creating component library with Sketch and Figma',
			link: 'https://github.com/username/design-system'
		},
		{
			id: 2,
			name: 'Responsive Dashboard',
			completed: true,
			notes: 'Data visualization for admin panel',
			link: ''
		},
		{
			id: 3,
			name: 'Mobile App Prototype',
			completed: false,
			notes: 'Design and user flow for e-commerce app',
			link: 'https://github.com/username/mobile-prototype'
		},
		{
			id: 1,
			name: 'UI Design System',
			completed: false,
			notes: 'Creating component library with Sketch and Figma',
			link: 'https://github.com/username/design-system'
		},
		{
			id: 2,
			name: 'Responsive Dashboard',
			completed: true,
			notes: 'Data visualization for admin panel',
			link: ''
		},
		{
			id: 3,
			name: 'Mobile App Prototype',
			completed: false,
			notes: 'Design and user flow for e-commerce app',
			link: 'https://github.com/username/mobile-prototype'
		}
	];

	// Theme handling
	let isDarkMode = false;

	// Toggle completion function
	function toggleComplete(id) {
		projects = projects.map((project) => {
			if (project.id === id) {
				return { ...project, completed: !project.completed };
			}
			return project;
		});
	}

	// Load data from LocalStorage and set up theme
	onMount(() => {
		// Load projects
		const savedProjects = localStorage.getItem('sketchbook-projects');
		if (savedProjects) {
			projects = JSON.parse(savedProjects);
		}

		// Set up theme detection and application
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const storedTheme = localStorage.getItem('color-theme');

		// Determine initial theme
		if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
			document.documentElement.classList.add('dark');
			isDarkMode = true;
		} else {
			document.documentElement.classList.remove('dark');
			isDarkMode = false;
		}

		// Listen for system theme changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			if (event.matches) {
				document.documentElement.classList.add('dark');
				isDarkMode = true;
			} else {
				document.documentElement.classList.remove('dark');
				isDarkMode = false;
			}
			localStorage.setItem('color-theme', isDarkMode ? 'dark' : 'light');
		});
	});

	// Save data when changed
	$: {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('sketchbook-projects', JSON.stringify(projects));
		}
	}
</script>

<svelte:head>
	<title>Project Sketchbook</title>
	<meta name="description" content="Tracking my projects and experiments" />
</svelte:head>

<!-- NewYork theme inspired styles -->
<div class="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
	<div class="container mx-auto max-w-3xl p-6">
		<header class="mb-10">
			<h1 class="mb-2 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
				Project Sketchbook
			</h1>
			<p class="text-neutral-500 dark:text-neutral-400">
				Projects, approaches, and ideas I've tried and learned from
			</p>
		</header>

		<!-- Projects List -->
		<div
			class="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
		>
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
					My Projects
				</h2>

				{#if projects.length === 0}
					<div class="py-8 text-center text-neutral-500 dark:text-neutral-400">
						<p>No projects added yet.</p>
						<p class="mt-2 text-sm">Edit the code to add your first project.</p>
					</div>
				{:else}
					<ul class="space-y-4">
						{#each projects as project (project.id)}
							<li
								in:fly={{ y: 20, duration: 300 }}
								out:fade
								class="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
							>
								<div class="flex items-start justify-between">
									<div class="flex flex-1 items-start space-x-3">
										<div class="mt-0.5">
											<input
												type="checkbox"
												checked={project.completed}
												on:change={() => toggleComplete(project.id)}
												class="h-5 w-5 rounded border-neutral-300 bg-white text-neutral-900 focus:ring-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:ring-neutral-400"
											/>
										</div>
										<div class="flex-1">
											{#if project.link}
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
														? 'text-neutral-500 line-through dark:text-neutral-400'
														: ''}"
												>
													{project.name}
												</h3>
											{/if}
											{#if project.notes}
												<p
													class="mt-1 text-sm text-neutral-500 dark:text-neutral-400 {project.completed
														? 'text-neutral-400 dark:text-neutral-600'
														: ''}"
												>
													{project.notes}
												</p>
											{/if}
										</div>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<footer class="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
			<p>Cihat Salik 2025</p>
		</footer>
	</div>
</div>

<style>
	:global(html) {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', 'SF Pro', 'Segoe UI', Roboto,
			system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	input[type='checkbox'] {
		cursor: pointer;
	}

	:global(.dark) input[type='checkbox'] {
		filter: hue-rotate(180deg) contrast(90%);
	}
</style>
