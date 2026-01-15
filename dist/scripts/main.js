const sidebarToggleBtn = document.getElementById('sidebarToggle');
const sidebarCloseBtn = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const navLinks = document.querySelectorAll('.nav-link');
function toggleSidebar() {
    sidebar?.classList.toggle('active');
    sidebarOverlay?.classList.toggle('active');
}
function closeSidebar() {
    sidebar?.classList.remove('active');
    sidebarOverlay?.classList.remove('active');
}
function openSidebar() {
    sidebar?.classList.add('active');
    sidebarOverlay?.classList.add('active');
}
sidebarToggleBtn?.addEventListener('click', toggleSidebar);
sidebarCloseBtn?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeSidebar();
    });
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeSidebar();
    }
});
function performSearch(query) {
    const searchData = [
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
    return searchData.filter((result) => result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()));
}
function handleSearch() {
    const query = searchInput.value.trim();
    if (query.length === 0) {
        console.log('Please enter a search query');
        return;
    }
    const results = performSearch(query);
    console.log(`Search results for "${query}":`, results);
    if (results.length > 0) {
        const projectsSection = document.getElementById('projects');
        projectsSection?.scrollIntoView({ behavior: 'smooth' });
    }
    else {
        console.log('No results found');
    }
    searchInput.value = '';
}
searchButton?.addEventListener('click', handleSearch);
searchInput?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
const logoLink = document.querySelector('.logo-link');
logoLink?.addEventListener('click', (_event) => {
    window.location.href = 'index.html';
});
function init() {
    console.log('Nerd or Geek? Website Initialized');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
function copyCode(button) {
    const codeBlock = button.closest('.docs-code-block');
    if (!codeBlock)
        return;
    const codeElement = codeBlock.querySelector('code');
    if (!codeElement)
        return;
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
window.copyCode = copyCode;
export { toggleSidebar, closeSidebar, openSidebar, performSearch, handleSearch, copyCode };
//# sourceMappingURL=main.js.map