import { writable } from 'svelte/store';

export const isDarkMode = writable(false);

export const darkMode = {
  setup: () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const updateDarkMode = (matches: boolean) => {
      if (matches) {
        document.documentElement.classList.add('dark');
        isDarkMode.set(true);
      } else {
        document.documentElement.classList.remove('dark');
        isDarkMode.set(false);
      }
    };

    updateDarkMode(prefersDark.matches);

    prefersDark.addEventListener('change', (e) => updateDarkMode(e.matches));

    return isDarkMode;
  }
};
