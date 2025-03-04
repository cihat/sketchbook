import { writable, derived } from 'svelte/store';
import type { Sketch, TimePeriod } from '../lib';
import { filterSketches, groupByWeek } from '../lib';

export const allSketches = writable<Sketch[]>([]);
export const loading = writable(true);
export const error = writable<string | null>(null);
export const categories = writable<string[]>([
  "System Design",
  "Design Patterns",
  "Algorithms",
  "Data Structures",
  'Design Pattern',
  "Approach",
  'Solution Technique',
  'Code Challenge',
  'Performance Optimization',
  "Principles",
  "Sketch",
  "Web",
  "Game",
  "Mobile",
  'Programming Language',
  "Blog",
  "Training",
  "Examples",
  'Computer Science',
]);
export const selectedCategory = writable<string | null>(null);
export const searchQuery = writable('');
export const sortOrder = writable<'oldest' | 'newest'>('oldest');
export const selectedTimePeriod = writable<TimePeriod | null>(null);

export const groupedSketches = derived(
  [allSketches, selectedCategory, searchQuery, sortOrder, selectedTimePeriod],
  ([$allSketches, $selectedCategory, $searchQuery, $sortOrder, $selectedTimePeriod]) => {
    const filtered = filterSketches(
      $allSketches,
      $selectedCategory,
      $searchQuery,
      $sortOrder,
      $selectedTimePeriod
    );
    return groupByWeek(filtered);
  }
);
