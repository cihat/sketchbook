// place files you want to import through the `$lib` alias in this folder.

export interface Project {
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
    projects: Project[], 
    sortOrder: 'oldest' | 'newest'
): Project[] {
    return [...projects].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'oldest'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
    });
}

export function filterProjects(
    allProjects: Project[],
    selectedCategory: string | null,
    searchQuery: string,
    sortOrder: 'oldest' | 'newest'
): Project[] {
    let filtered = [...allProjects];

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
