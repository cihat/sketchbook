export interface Sketch {
  id: string | number;
  name: string;
  notes: string;
  category: string;
  date: string;
  link?: string;
  completed?: boolean;
}

export const categoryEmojis: Record<string, string> = {
  'Design Pattern': '🏛️',
  Approach: '🧠',
  'Solution Technique': '🛠️',
  'Code Challenge': '🏆',
  'Performance Optimization': '⚡',
  Principles: '📐',
  Sketch: '✏️',
  Web: '🌐',
  Game: '🎮',
  Mobile: '📱',
  'Programming Language': '💻',
  Blog: '📝',
  Training: '🏋️',
  Examples: '📋',
  'Computer Science': '🔬'
};

export function getEmoji(category: string): string {
  return categoryEmojis[category] || '🔍';
}

export function getWeekNumber(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `Week ${weekNumber}, ${date.getFullYear()}`;
}

export function groupByWeek(sketches: Sketch[]): Record<string, Sketch[]> {
  return sketches.reduce((groups: Record<string, Sketch[]>, sketch) => {
    const date = new Date(sketch.date);
    const weekKey = getWeekNumber(date);
    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(sketch);
    return groups;
  }, {});
}

export function updateURL(selectedCategory: string | null): void {
  if (selectedCategory) {
    const url = new URL(window.location.href);
    url.searchParams.set('category', selectedCategory);
    window.history.pushState({}, '', url);
  } else {
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);
  }
}

export function sortProjects(
  projects: Sketch[],
  sortOrder: 'oldest' | 'newest'
): Sketch[] {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'oldest'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}

export type TimePeriod =
  | 'this-week'
  | 'last-week'
  | 'next-week'
  | 'last-month'
  | 'last-2-months'
  | 'last-3-months'
  | 'last-6-months';

function isWithinPeriod(date: Date, period: TimePeriod): boolean {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  switch (period) {
    case 'this-week': {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return date >= startOfWeek && date <= endOfWeek;
    }
    case 'last-week': {
      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
      return date >= startOfLastWeek && date <= endOfLastWeek;
    }
    case 'next-week': {
      const startOfNextWeek = new Date(startOfWeek);
      startOfNextWeek.setDate(startOfWeek.getDate() + 7);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return date >= startOfNextWeek && date <= endOfNextWeek;
    }
    case 'last-month': {
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      return date >= lastMonth;
    }
    case 'last-2-months': {
      const twoMonthsAgo = new Date(now);
      twoMonthsAgo.setMonth(now.getMonth() - 2);
      return date >= twoMonthsAgo;
    }
    case 'last-3-months': {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return date >= threeMonthsAgo;
    }
    case 'last-6-months': {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return date >= sixMonthsAgo;
    }
    default:
      return true;
  }
}

export function filterProjectsByTimePeriod(
  projects: Sketch[],
  period: TimePeriod | null
): Sketch[] {
  if (!period) return projects;

  return projects.filter(project => {
    const projectDate = new Date(project.date);
    return isWithinPeriod(projectDate, period);
  });
}

export function filterProjects(
  allProjects: Sketch[],
  selectedCategory: string | null,
  searchQuery: string,
  sortOrder: 'oldest' | 'newest',
  timePeriod: TimePeriod | null
): Sketch[] {
  let filtered = [...allProjects];

  if (timePeriod) {
    filtered = filterProjectsByTimePeriod(filtered, timePeriod);
  }

  if (selectedCategory) {
    filtered = filtered.filter((project) => project.category === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.notes.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query)
    );
  }

  return sortProjects(filtered, sortOrder);
}
