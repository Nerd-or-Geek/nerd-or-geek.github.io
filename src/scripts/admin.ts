/**
 * Admin Portal TypeScript
 * Handles all admin functionality for managing affiliates, projects, and software
 */

// ============================================
// Types
// ============================================
interface Affiliate {
    id: string;
    name: string;
    description: string;
    link: string;
    icon: string;
    customImage?: string;
    comingSoon: boolean;
    createdAt: number;
}

interface ProjectSection {
    id: string;
    title: string;
    type: 'text' | 'cards-2' | 'cards-3' | 'code' | 'callout';
    content: string;
    order: number;
}

interface Project {
    id: string;
    name: string;
    description: string;
    badge: string;
    tags: string[];
    icon: string;
    customImage?: string;
    sections: ProjectSection[];
    createdAt: number;
}

interface Software {
    id: string;
    name: string;
    description: string;
    link: string;
    icon: string;
    customImage?: string;
    underDevelopment: boolean;
    createdAt: number;
}

interface AdminData {
    affiliates: Affiliate[];
    projects: Project[];
    software: Software[];
}

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEY = 'nerdOrGeekAdminData';

// ============================================
// Data Management
// ============================================
function getAdminData(): AdminData {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return { affiliates: [], projects: [], software: [] };
}

function saveAdminData(data: AdminData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message: string, isError: boolean = false): void {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// ============================================
// Modal Management
// ============================================
function openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    modal?.classList.add('active');
}

function closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    modal?.classList.remove('active');
}

function setupModalCloseHandlers(): void {
    // Close buttons
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
    
    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// ============================================
// Icon Selector
// ============================================
function setupIconSelectors(): void {
    document.querySelectorAll('.icon-options').forEach(container => {
        container.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove active from siblings
                container.querySelectorAll('.icon-option').forEach(opt => 
                    opt.classList.remove('active')
                );
                // Add active to clicked
                option.classList.add('active');
                
                // Update hidden input
                const icon = option.getAttribute('data-icon');
                const hiddenInput = container.closest('.icon-selector')?.parentElement?.querySelector('input[type="hidden"]') as HTMLInputElement;
                if (hiddenInput && icon) {
                    hiddenInput.value = icon;
                }
                
                // Clear custom input
                const customInput = container.closest('.icon-selector')?.querySelector('input[type="text"]') as HTMLInputElement;
                if (customInput) {
                    customInput.value = '';
                }
            });
        });
    });
    
    // Custom icon/image input handling
    document.querySelectorAll('.custom-icon-input input').forEach(input => {
        input.addEventListener('input', () => {
            const container = input.closest('.icon-selector');
            if (container) {
                // Deselect preset icons
                container.querySelectorAll('.icon-option').forEach(opt => 
                    opt.classList.remove('active')
                );
            }
        });
    });
}

// ============================================
// Navigation
// ============================================
function setupNavigation(): void {
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-section');
            
            // Update nav buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update sections
            sections.forEach(section => {
                section.classList.toggle('active', section.id === `section-${sectionId}`);
            });
        });
    });
}

// ============================================
// Affiliates
// ============================================
function renderAffiliates(): void {
    const container = document.getElementById('affiliatesList');
    if (!container) return;
    
    const data = getAdminData();
    
    if (data.affiliates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-handshake"></i>
                <h4>No Affiliates Yet</h4>
                <p>Click "Add Affiliate" to create your first affiliate partner.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = data.affiliates.map(affiliate => `
        <div class="item-card" data-id="${affiliate.id}">
            <div class="item-card-header">
                <div class="item-icon">
                    ${affiliate.customImage 
                        ? `<img src="${affiliate.customImage}" alt="${affiliate.name}">`
                        : `<i class="fas ${affiliate.icon}"></i>`
                    }
                </div>
                <div class="item-info">
                    <h4>
                        ${escapeHtml(affiliate.name)}
                        ${affiliate.comingSoon ? '<span class="item-badge coming-soon">Coming Soon</span>' : ''}
                    </h4>
                    <p>${escapeHtml(affiliate.description)}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="item-action-btn edit-btn" data-id="${affiliate.id}" data-type="affiliate">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="item-action-btn delete-btn" data-id="${affiliate.id}" data-type="affiliate">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    setupItemActions();
}

function openAffiliateModal(affiliate?: Affiliate): void {
    const modal = document.getElementById('affiliateModal');
    const title = document.getElementById('affiliateModalTitle');
    const form = document.getElementById('affiliateForm') as HTMLFormElement;
    
    if (!modal || !title || !form) return;
    
    // Reset form
    form.reset();
    
    // Reset icon selection
    const iconOptions = modal.querySelectorAll('.icon-option');
    iconOptions.forEach(opt => opt.classList.remove('active'));
    iconOptions[0]?.classList.add('active');
    
    if (affiliate) {
        title.textContent = 'Edit Affiliate';
        (document.getElementById('affiliateId') as HTMLInputElement).value = affiliate.id;
        (document.getElementById('affiliateName') as HTMLInputElement).value = affiliate.name;
        (document.getElementById('affiliateDescription') as HTMLTextAreaElement).value = affiliate.description;
        (document.getElementById('affiliateLink') as HTMLInputElement).value = affiliate.link;
        (document.getElementById('affiliateIcon') as HTMLInputElement).value = affiliate.icon;
        (document.getElementById('affiliateComingSoon') as HTMLInputElement).checked = affiliate.comingSoon;
        
        // Set icon
        if (affiliate.customImage) {
            (document.getElementById('affiliateCustomIcon') as HTMLInputElement).value = affiliate.customImage;
            iconOptions.forEach(opt => opt.classList.remove('active'));
        } else {
            const iconOpt = modal.querySelector(`[data-icon="${affiliate.icon}"]`);
            if (iconOpt) {
                iconOptions.forEach(opt => opt.classList.remove('active'));
                iconOpt.classList.add('active');
            }
        }
    } else {
        title.textContent = 'Add Affiliate';
        (document.getElementById('affiliateId') as HTMLInputElement).value = '';
        (document.getElementById('affiliateIcon') as HTMLInputElement).value = 'fa-graduation-cap';
    }
    
    openModal('affiliateModal');
}

function saveAffiliate(e: Event): void {
    e.preventDefault();
    
    const id = (document.getElementById('affiliateId') as HTMLInputElement).value;
    const name = (document.getElementById('affiliateName') as HTMLInputElement).value.trim();
    const description = (document.getElementById('affiliateDescription') as HTMLTextAreaElement).value.trim();
    const link = (document.getElementById('affiliateLink') as HTMLInputElement).value.trim();
    const icon = (document.getElementById('affiliateIcon') as HTMLInputElement).value;
    const customIcon = (document.getElementById('affiliateCustomIcon') as HTMLInputElement).value.trim();
    const comingSoon = (document.getElementById('affiliateComingSoon') as HTMLInputElement).checked;
    
    const data = getAdminData();
    
    const affiliate: Affiliate = {
        id: id || generateId(),
        name,
        description,
        link,
        icon: customIcon ? 'custom' : icon,
        customImage: customIcon || undefined,
        comingSoon,
        createdAt: id ? (data.affiliates.find(a => a.id === id)?.createdAt || Date.now()) : Date.now()
    };
    
    if (id) {
        const index = data.affiliates.findIndex(a => a.id === id);
        if (index !== -1) {
            data.affiliates[index] = affiliate;
        }
    } else {
        data.affiliates.push(affiliate);
    }
    
    saveAdminData(data);
    closeModal('affiliateModal');
    renderAffiliates();
    showToast(id ? 'Affiliate updated!' : 'Affiliate added!');
}

// ============================================
// Projects
// ============================================
function renderProjects(): void {
    const container = document.getElementById('projectsList');
    if (!container) return;
    
    const data = getAdminData();
    
    if (data.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h4>No Projects Yet</h4>
                <p>Click "Add Project" to create your first project.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = data.projects.map(project => `
        <div class="item-card" data-id="${project.id}">
            <div class="item-card-header">
                <div class="item-icon">
                    ${project.customImage 
                        ? `<img src="${project.customImage}" alt="${project.name}">`
                        : `<i class="fas ${project.icon}"></i>`
                    }
                </div>
                <div class="item-info">
                    <h4>
                        ${escapeHtml(project.name)}
                        ${project.badge ? `<span class="item-badge">${project.badge}</span>` : ''}
                    </h4>
                    <p>${escapeHtml(project.description)}</p>
                </div>
            </div>
            ${project.tags.length > 0 ? `
                <div class="item-tags">
                    ${project.tags.map(tag => `<span class="item-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="item-actions">
                <button class="item-action-btn edit-btn" data-id="${project.id}" data-type="project">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="item-action-btn docs-btn" data-id="${project.id}" data-type="project">
                    <i class="fas fa-file-alt"></i> Docs
                </button>
                <button class="item-action-btn delete-btn" data-id="${project.id}" data-type="project">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    setupItemActions();
}

function openProjectModal(project?: Project): void {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm') as HTMLFormElement;
    
    if (!modal || !title || !form) return;
    
    form.reset();
    
    const iconOptions = modal.querySelectorAll('.icon-option');
    iconOptions.forEach(opt => opt.classList.remove('active'));
    iconOptions[0]?.classList.add('active');
    
    if (project) {
        title.textContent = 'Edit Project';
        (document.getElementById('projectId') as HTMLInputElement).value = project.id;
        (document.getElementById('projectName') as HTMLInputElement).value = project.name;
        (document.getElementById('projectDescription') as HTMLTextAreaElement).value = project.description;
        (document.getElementById('projectBadge') as HTMLSelectElement).value = project.badge;
        (document.getElementById('projectTags') as HTMLInputElement).value = project.tags.join(', ');
        (document.getElementById('projectIcon') as HTMLInputElement).value = project.icon;
        
        if (project.customImage) {
            (document.getElementById('projectCustomImage') as HTMLInputElement).value = project.customImage;
            iconOptions.forEach(opt => opt.classList.remove('active'));
        } else {
            const iconOpt = modal.querySelector(`[data-icon="${project.icon}"]`);
            if (iconOpt) {
                iconOptions.forEach(opt => opt.classList.remove('active'));
                iconOpt.classList.add('active');
            }
        }
    } else {
        title.textContent = 'Add Project';
        (document.getElementById('projectId') as HTMLInputElement).value = '';
        (document.getElementById('projectIcon') as HTMLInputElement).value = 'fa-cube';
    }
    
    openModal('projectModal');
}

function saveProject(e: Event): void {
    e.preventDefault();
    
    const id = (document.getElementById('projectId') as HTMLInputElement).value;
    const name = (document.getElementById('projectName') as HTMLInputElement).value.trim();
    const description = (document.getElementById('projectDescription') as HTMLTextAreaElement).value.trim();
    const badge = (document.getElementById('projectBadge') as HTMLSelectElement).value;
    const tagsStr = (document.getElementById('projectTags') as HTMLInputElement).value;
    const icon = (document.getElementById('projectIcon') as HTMLInputElement).value;
    const customImage = (document.getElementById('projectCustomImage') as HTMLInputElement).value.trim();
    
    const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
    
    const data = getAdminData();
    const existingProject = data.projects.find(p => p.id === id);
    
    const project: Project = {
        id: id || generateId(),
        name,
        description,
        badge,
        tags,
        icon: customImage ? 'custom' : icon,
        customImage: customImage || undefined,
        sections: existingProject?.sections || [],
        createdAt: existingProject?.createdAt || Date.now()
    };
    
    if (id) {
        const index = data.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            data.projects[index] = project;
        }
    } else {
        data.projects.push(project);
    }
    
    saveAdminData(data);
    closeModal('projectModal');
    renderProjects();
    showToast(id ? 'Project updated!' : 'Project added!');
}

// ============================================
// Documentation Editor
// ============================================
let currentEditingSection: ProjectSection | null = null;

function openDocsEditor(projectId: string): void {
    const data = getAdminData();
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) {
        showToast('Project not found', true);
        return;
    }
    
    (document.getElementById('docsProjectId') as HTMLInputElement).value = projectId;
    (document.getElementById('docsModalTitle') as HTMLElement).textContent = `Documentation: ${project.name}`;
    
    renderDocsSections(project);
    openModal('docsModal');
}

function renderDocsSections(project: Project): void {
    const container = document.getElementById('docsSectionsList');
    if (!container) return;
    
    if (project.sections.length === 0) {
        container.innerHTML = '<p class="no-section-selected">No sections yet. Add one to get started.</p>';
        return;
    }
    
    const sortedSections = [...project.sections].sort((a, b) => a.order - b.order);
    
    container.innerHTML = sortedSections.map(section => `
        <div class="docs-section-item" data-id="${section.id}">
            <span>${escapeHtml(section.title)}</span>
            <div class="section-actions">
                <button class="edit-section" data-id="${section.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-section" data-id="${section.id}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.docs-section-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.section-actions')) return;
            
            const sectionId = item.getAttribute('data-id');
            const section = project.sections.find(s => s.id === sectionId);
            if (section) {
                selectSection(section, project.id);
            }
        });
        
        item.querySelector('.edit-section')?.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-id');
            const section = project.sections.find(s => s.id === sectionId);
            if (section) {
                openSectionModal(section, project.id);
            }
        });
        
        item.querySelector('.delete-section')?.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-id');
            if (confirm('Delete this section?')) {
                deleteSection(sectionId!, project.id);
            }
        });
    });
}

function selectSection(section: ProjectSection, projectId: string): void {
    const container = document.getElementById('currentSectionEditor');
    if (!container) return;
    
    // Update active state
    document.querySelectorAll('.docs-section-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-id') === section.id);
    });
    
    container.innerHTML = `
        <div class="section-preview">
            <h3>${escapeHtml(section.title)}</h3>
            <p class="section-type"><strong>Type:</strong> ${section.type}</p>
            <div class="section-content-preview">
                <strong>Content:</strong>
                <pre>${escapeHtml(section.content)}</pre>
            </div>
            <button class="btn-primary" onclick="openSectionModalById('${section.id}', '${projectId}')">
                <i class="fas fa-edit"></i> Edit Section
            </button>
        </div>
    `;
}

function openSectionModal(section?: ProjectSection, projectId?: string): void {
    const form = document.getElementById('sectionForm') as HTMLFormElement;
    const title = document.getElementById('sectionModalTitle');
    
    if (!form || !title) return;
    
    form.reset();
    
    if (section) {
        title.textContent = 'Edit Section';
        (document.getElementById('sectionId') as HTMLInputElement).value = section.id;
        (document.getElementById('sectionProjectId') as HTMLInputElement).value = projectId || '';
        (document.getElementById('sectionTitle') as HTMLInputElement).value = section.title;
        (document.getElementById('sectionType') as HTMLSelectElement).value = section.type;
        (document.getElementById('sectionContent') as HTMLTextAreaElement).value = section.content;
    } else {
        title.textContent = 'Add Section';
        (document.getElementById('sectionId') as HTMLInputElement).value = '';
        (document.getElementById('sectionProjectId') as HTMLInputElement).value = 
            (document.getElementById('docsProjectId') as HTMLInputElement)?.value || '';
    }
    
    openModal('sectionModal');
}

function saveSection(e: Event): void {
    e.preventDefault();
    
    const id = (document.getElementById('sectionId') as HTMLInputElement).value;
    const projectId = (document.getElementById('sectionProjectId') as HTMLInputElement).value;
    const title = (document.getElementById('sectionTitle') as HTMLInputElement).value.trim();
    const type = (document.getElementById('sectionType') as HTMLSelectElement).value as ProjectSection['type'];
    const content = (document.getElementById('sectionContent') as HTMLTextAreaElement).value;
    
    const data = getAdminData();
    const projectIndex = data.projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        showToast('Project not found', true);
        return;
    }
    
    const project = data.projects[projectIndex];
    
    const section: ProjectSection = {
        id: id || generateId(),
        title,
        type,
        content,
        order: id 
            ? (project.sections.find(s => s.id === id)?.order || project.sections.length)
            : project.sections.length
    };
    
    if (id) {
        const sectionIndex = project.sections.findIndex(s => s.id === id);
        if (sectionIndex !== -1) {
            project.sections[sectionIndex] = section;
        }
    } else {
        project.sections.push(section);
    }
    
    saveAdminData(data);
    closeModal('sectionModal');
    renderDocsSections(project);
    showToast(id ? 'Section updated!' : 'Section added!');
}

function deleteSection(sectionId: string, projectId: string): void {
    const data = getAdminData();
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    project.sections = project.sections.filter(s => s.id !== sectionId);
    saveAdminData(data);
    renderDocsSections(project);
    
    // Clear editor
    const editor = document.getElementById('currentSectionEditor');
    if (editor) {
        editor.innerHTML = '<p class="no-section-selected">Select a section to edit or add a new one.</p>';
    }
    
    showToast('Section deleted!');
}

// ============================================
// Software
// ============================================
function renderSoftware(): void {
    const container = document.getElementById('softwareList');
    if (!container) return;
    
    const data = getAdminData();
    
    if (data.software.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code"></i>
                <h4>No Software Yet</h4>
                <p>Click "Add Software" to add your first software or tool.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = data.software.map(sw => `
        <div class="item-card" data-id="${sw.id}">
            <div class="item-card-header">
                <div class="item-icon">
                    ${sw.customImage 
                        ? `<img src="${sw.customImage}" alt="${sw.name}">`
                        : `<i class="fas ${sw.icon}"></i>`
                    }
                </div>
                <div class="item-info">
                    <h4>
                        ${escapeHtml(sw.name)}
                        ${sw.underDevelopment ? '<span class="item-badge under-dev">Under Development</span>' : ''}
                    </h4>
                    <p>${escapeHtml(sw.description)}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="item-action-btn edit-btn" data-id="${sw.id}" data-type="software">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="item-action-btn delete-btn" data-id="${sw.id}" data-type="software">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    setupItemActions();
}

function openSoftwareModal(software?: Software): void {
    const modal = document.getElementById('softwareModal');
    const title = document.getElementById('softwareModalTitle');
    const form = document.getElementById('softwareForm') as HTMLFormElement;
    
    if (!modal || !title || !form) return;
    
    form.reset();
    
    const iconOptions = modal.querySelectorAll('.icon-option');
    iconOptions.forEach(opt => opt.classList.remove('active'));
    iconOptions[0]?.classList.add('active');
    
    if (software) {
        title.textContent = 'Edit Software';
        (document.getElementById('softwareId') as HTMLInputElement).value = software.id;
        (document.getElementById('softwareName') as HTMLInputElement).value = software.name;
        (document.getElementById('softwareDescription') as HTMLTextAreaElement).value = software.description;
        (document.getElementById('softwareLink') as HTMLInputElement).value = software.link;
        (document.getElementById('softwareIcon') as HTMLInputElement).value = software.icon;
        (document.getElementById('softwareUnderDev') as HTMLInputElement).checked = software.underDevelopment;
        
        if (software.customImage) {
            (document.getElementById('softwareCustomImage') as HTMLInputElement).value = software.customImage;
            iconOptions.forEach(opt => opt.classList.remove('active'));
        } else {
            const iconOpt = modal.querySelector(`[data-icon="${software.icon}"]`);
            if (iconOpt) {
                iconOptions.forEach(opt => opt.classList.remove('active'));
                iconOpt.classList.add('active');
            }
        }
    } else {
        title.textContent = 'Add Software';
        (document.getElementById('softwareId') as HTMLInputElement).value = '';
        (document.getElementById('softwareIcon') as HTMLInputElement).value = 'fa-code';
    }
    
    openModal('softwareModal');
}

function saveSoftware(e: Event): void {
    e.preventDefault();
    
    const id = (document.getElementById('softwareId') as HTMLInputElement).value;
    const name = (document.getElementById('softwareName') as HTMLInputElement).value.trim();
    const description = (document.getElementById('softwareDescription') as HTMLTextAreaElement).value.trim();
    const link = (document.getElementById('softwareLink') as HTMLInputElement).value.trim();
    const icon = (document.getElementById('softwareIcon') as HTMLInputElement).value;
    const customImage = (document.getElementById('softwareCustomImage') as HTMLInputElement).value.trim();
    const underDevelopment = (document.getElementById('softwareUnderDev') as HTMLInputElement).checked;
    
    const data = getAdminData();
    
    const software: Software = {
        id: id || generateId(),
        name,
        description,
        link,
        icon: customImage ? 'custom' : icon,
        customImage: customImage || undefined,
        underDevelopment,
        createdAt: id ? (data.software.find(s => s.id === id)?.createdAt || Date.now()) : Date.now()
    };
    
    if (id) {
        const index = data.software.findIndex(s => s.id === id);
        if (index !== -1) {
            data.software[index] = software;
        }
    } else {
        data.software.push(software);
    }
    
    saveAdminData(data);
    closeModal('softwareModal');
    renderSoftware();
    showToast(id ? 'Software updated!' : 'Software added!');
}

// ============================================
// Item Actions (Edit/Delete)
// ============================================
function setupItemActions(): void {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
            const data = getAdminData();
            
            if (type === 'affiliate') {
                const affiliate = data.affiliates.find(a => a.id === id);
                if (affiliate) openAffiliateModal(affiliate);
            } else if (type === 'project') {
                const project = data.projects.find(p => p.id === id);
                if (project) openProjectModal(project);
            } else if (type === 'software') {
                const software = data.software.find(s => s.id === id);
                if (software) openSoftwareModal(software);
            }
        });
    });
    
    // Docs buttons (projects only)
    document.querySelectorAll('.docs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) openDocsEditor(id);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
            
            if (!confirm('Are you sure you want to delete this item?')) return;
            
            const data = getAdminData();
            
            if (type === 'affiliate') {
                data.affiliates = data.affiliates.filter(a => a.id !== id);
                saveAdminData(data);
                renderAffiliates();
            } else if (type === 'project') {
                data.projects = data.projects.filter(p => p.id !== id);
                saveAdminData(data);
                renderProjects();
            } else if (type === 'software') {
                data.software = data.software.filter(s => s.id !== id);
                saveAdminData(data);
                renderSoftware();
            }
            
            showToast('Item deleted!');
        });
    });
}

// ============================================
// Import/Export
// ============================================
function exportData(): void {
    const data = getAdminData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nerd-or-geek-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
}

function importData(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string) as AdminData;
            
            // Validate structure
            if (!data.affiliates || !data.projects || !data.software) {
                throw new Error('Invalid data structure');
            }
            
            saveAdminData(data);
            renderAffiliates();
            renderProjects();
            renderSoftware();
            showToast('Data imported successfully!');
        } catch (error) {
            showToast('Failed to import data. Invalid file format.', true);
        }
    };
    reader.readAsText(file);
}

function clearAllData(): void {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone!')) return;
    if (!confirm('This will permanently delete all affiliates, projects, and software. Continue?')) return;
    
    localStorage.removeItem(STORAGE_KEY);
    renderAffiliates();
    renderProjects();
    renderSoftware();
    showToast('All data cleared!');
}

// ============================================
// Utility Functions
// ============================================
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global function for inline onclick
(window as any).openSectionModalById = (sectionId: string, projectId: string) => {
    const data = getAdminData();
    const project = data.projects.find(p => p.id === projectId);
    const section = project?.sections.find(s => s.id === sectionId);
    if (section) {
        openSectionModal(section, projectId);
    }
};

// ============================================
// Initialization
// ============================================
function init(): void {
    setupNavigation();
    setupModalCloseHandlers();
    setupIconSelectors();
    
    // Render initial data
    renderAffiliates();
    renderProjects();
    renderSoftware();
    
    // Form submissions
    document.getElementById('affiliateForm')?.addEventListener('submit', saveAffiliate);
    document.getElementById('projectForm')?.addEventListener('submit', saveProject);
    document.getElementById('softwareForm')?.addEventListener('submit', saveSoftware);
    document.getElementById('sectionForm')?.addEventListener('submit', saveSection);
    
    // Add buttons
    document.getElementById('addAffiliate')?.addEventListener('click', () => openAffiliateModal());
    document.getElementById('addProject')?.addEventListener('click', () => openProjectModal());
    document.getElementById('addSoftware')?.addEventListener('click', () => openSoftwareModal());
    document.getElementById('addDocsSection')?.addEventListener('click', () => openSectionModal());
    
    // Import/Export
    document.getElementById('exportData')?.addEventListener('click', exportData);
    document.getElementById('exportAllData')?.addEventListener('click', exportData);
    document.getElementById('importData')?.addEventListener('click', () => {
        document.getElementById('importFile')?.click();
    });
    document.getElementById('importFile')?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) importData(file);
    });
    document.getElementById('clearAllData')?.addEventListener('click', clearAllData);
    
    console.log('Admin Portal initialized');
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
