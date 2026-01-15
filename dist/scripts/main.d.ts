interface SearchResult {
    title: string;
    url: string;
    description: string;
}
declare function toggleSidebar(): void;
declare function closeSidebar(): void;
declare function openSidebar(): void;
declare function performSearch(query: string): SearchResult[];
declare function handleSearch(): void;
declare function copyCode(button: HTMLButtonElement): void;
export { toggleSidebar, closeSidebar, openSidebar, performSearch, handleSearch, copyCode };
//# sourceMappingURL=main.d.ts.map