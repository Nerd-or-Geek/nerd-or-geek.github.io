/**
 * Main TypeScript file for Nerd or Geek? website
 * Handles sidebar toggling, search functionality, and other interactive elements
 */

// ============================================
// Types
// ============================================
interface SearchResult {
    title: string;
    url: string;
    description: string;
}

// ============================================
// DOM Elements
// ============================================
const sidebarToggleBtn = document.getElementById('sidebarToggle');
const sidebarCloseBtn = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchButton = document.getElementById('searchButton');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Sidebar Functions
// ============================================

/**
 * Toggle sidebar visibility
 */
function toggleSidebar(): void {
    sidebar?.classList.toggle('active');
    sidebarOverlay?.classList.toggle('active');
}

/**
 * Close sidebar
 */
function closeSidebar(): void {
    sidebar?.classList.remove('active');
    sidebarOverlay?.classList.remove('active');
}

/**
 * Open sidebar
 */
function openSidebar(): void {
    sidebar?.classList.add('active');
    sidebarOverlay?.classList.add('active');
}

// ============================================
// Event Listeners - Sidebar
// ============================================
sidebarToggleBtn?.addEventListener('click', toggleSidebar);
sidebarCloseBtn?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is clicked
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeSidebar();
    });
});

// Close sidebar on escape key
document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeSidebar();
    }
});

// ============================================
// Search Functions
// ============================================

/**
 * Mock search function - can be replaced with actual search logic
 * @param query - The search query string
 * @returns Array of search results
 */
function performSearch(query: string): SearchResult[] {
    const searchData: SearchResult[] = [
        {
            title: 'Project One',
            url: '#projects',
            description: 'An awesome project showcasing web development',
        },
        {
            title: 'Project Two',
            url: '#projects',
            description: 'A unique project with amazing features',
        },
        {
            title: 'Project Three',
            url: '#projects',
            description: 'Innovative solution for modern problems',
        },
    ];

    // Simple search filter
    return searchData.filter(
        (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
    );
}

/**
 * Handle search submission
 */
function handleSearch(): void {
    const query = searchInput.value.trim();

    if (query.length === 0) {
        console.log('Please enter a search query');
        return;
    }

    const results = performSearch(query);
    console.log(`Search results for "${query}":`, results);

    // TODO: Display search results or navigate to results page
    // For now, scroll to projects section if any results found
    if (results.length > 0) {
        const projectsSection = document.getElementById('projects');
        projectsSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log('No results found');
    }

    // Clear search input
    searchInput.value = '';
}

// ============================================
// Event Listeners - Search
// ============================================
searchButton?.addEventListener('click', handleSearch);

searchInput?.addEventListener('keypress', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// ============================================
// Logo Link Handler
// ============================================
const logoLink = document.querySelector('.logo-link');
logoLink?.addEventListener('click', (_event: Event) => {
    // Navigate to homepage
    window.location.href = 'index.html';
});

// ============================================
// Initialization
// ============================================

/**
 * Initialize the application
 */
function init(): void {
    console.log('Nerd or Geek? Website Initialized');

    // Set up any additional initialization here
    // Examples:
    // - Load user preferences from localStorage
    // - Initialize analytics
    // - Fetch initial data from API
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Copy Code Function (for documentation pages)
// ============================================

/**
 * Copy code block content to clipboard
 */
function copyCode(button: HTMLButtonElement): void {
    const codeBlock = button.closest('.docs-code-block');
    if (!codeBlock) return;

    const codeElement = codeBlock.querySelector('code');
    if (!codeElement) return;

    const text = codeElement.textContent || '';
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch((err) => {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

// Make copyCode available globally for onclick handlers
(window as unknown as { copyCode: typeof copyCode }).copyCode = copyCode;

// ============================================
// Export for module usage
// ============================================
export { toggleSidebar, closeSidebar, openSidebar, performSearch, handleSearch, copyCode };
