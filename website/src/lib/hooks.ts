import type { Sketch } from '.';

export function useProjects() {
  const sketches: Sketch[] = [];
  let allProjects: Sketch[] = [];
  let loading: boolean = true;
  let error: string | null = null;
  let categories: string[] = [];

  const loadProjects = async () => {
    try {
      const response = await fetch('/sketches.json');
      if (!response.ok) {
        throw new Error('Failed to load sketches data');
      }
      const data = await response.json();

      allProjects = data;

      const categorySet = new Set(data.map((project: Sketch) => project.category));
      categories = Array.from(categorySet) as string[];

      loading = false;
      return { allProjects, categories };
    } catch (err) {
      console.error('Error loading sketches:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
      loading = false;
      return { error };
    }
  };

  return {
    loadProjects,
    sketches,
    allProjects,
    loading,
    error,
    categories
  };
}

export function useDarkMode() {
  let isDarkMode: boolean = false;

  const setupDarkMode = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDark) {
      document.documentElement.classList.add('dark');
      isDarkMode = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDarkMode = false;
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
        isDarkMode = true;
      } else {
        document.documentElement.classList.remove('dark');
        isDarkMode = false;
      }
    });

    return isDarkMode;
  };

  return { setupDarkMode };
}

export function useURLParams() {
  const getURLCategory = (categories: string[]): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam && categories.includes(categoryParam)) {
      return categoryParam;
    }

    return null;
  };

  return { getURLCategory };
}
