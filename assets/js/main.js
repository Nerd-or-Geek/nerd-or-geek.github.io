// Sidebar toggle functionality
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.sidebar-toggle');

if (sidebar && toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}

// Close sidebar on link click (mobile)
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 900) {
      sidebar.classList.add('collapsed');
    }
  });
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth < 900 && sidebar && toggleBtn) {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && !sidebar.classList.contains('collapsed')) {
      sidebar.classList.add('collapsed');
    }
  }
});

// Search functionality
const searchInput = document.querySelector('.header-search input[type="search"]');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
      console.log('Searching for:', query);
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add active link highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt+/ to open search
  if ((e.altKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    if (searchInput) searchInput.focus();
  }
  
  // Esc to close sidebar on mobile
  if (e.key === 'Escape' && window.innerWidth < 900 && sidebar) {
    sidebar.classList.add('collapsed');
  }
});

// Responsive behavior
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900 && sidebar) {
    sidebar.classList.remove('collapsed');
  }
});
