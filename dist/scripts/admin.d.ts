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
declare const STORAGE_KEY = "nerdOrGeekAdminData";
declare function getAdminData(): AdminData;
declare function saveAdminData(data: AdminData): void;
declare function generateId(): string;
declare function showToast(message: string, isError?: boolean): void;
declare function openModal(modalId: string): void;
declare function closeModal(modalId: string): void;
declare function setupModalCloseHandlers(): void;
declare function setupIconSelectors(): void;
declare function setupNavigation(): void;
declare function renderAffiliates(): void;
declare function openAffiliateModal(affiliate?: Affiliate): void;
declare function saveAffiliate(e: Event): void;
declare function renderProjects(): void;
declare function openProjectModal(project?: Project): void;
declare function saveProject(e: Event): void;
declare let currentEditingSection: ProjectSection | null;
declare function openDocsEditor(projectId: string): void;
declare function renderDocsSections(project: Project): void;
declare function selectSection(section: ProjectSection, projectId: string): void;
declare function openSectionModal(section?: ProjectSection, projectId?: string): void;
declare function saveSection(e: Event): void;
declare function deleteSection(sectionId: string, projectId: string): void;
declare function renderSoftware(): void;
declare function openSoftwareModal(software?: Software): void;
declare function saveSoftware(e: Event): void;
declare function setupItemActions(): void;
declare function exportData(): void;
declare function importData(file: File): void;
declare function clearAllData(): void;
declare function escapeHtml(text: string): string;
declare function init(): void;
//# sourceMappingURL=admin.d.ts.map