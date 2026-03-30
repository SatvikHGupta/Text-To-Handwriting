// UI slice: sidebar, dark mode, modals, zoom, and mobile tab state

export function createUISlice(set) {
  return {
    sidebarOpen:    true,
    toggleSidebar:  () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (v) => set({ sidebarOpen: v }),

    darkMode: false,
    toggleDarkMode: () => set((s) => {
      const next = !s.darkMode;
      document.documentElement.classList.toggle('dark',  next);
      document.documentElement.classList.toggle('light', !next);
      return { darkMode: next };
    }),

    // one boolean per modal
    exportModalOpen: false,
    fontPickerOpen:  false,
    helpOpen:        false,
    colorTagsOpen:   false,

    setExportModalOpen: (v) => set({ exportModalOpen: v }),
    setFontPickerOpen:  (v) => set({ fontPickerOpen:  v }),
    setHelpOpen:        (v) => set({ helpOpen:        v }),
    setColorTagsOpen:   (v) => set({ colorTagsOpen:   v }),

    activeView:    'preview',
    setActiveView: (v) => set({ activeView: v }),

    zoom:      0.50,
    zoomIn:    () => set((s) => ({ zoom: Math.min(+(s.zoom + 0.1).toFixed(2), 1.5) })),
    zoomOut:   () => set((s) => ({ zoom: Math.max(+(s.zoom - 0.1).toFixed(2), 0.3) })),
    resetZoom: () => set({ zoom: 0.50 }),

    // mobile tab: which panel is active on small screens
    // 'page' | 'settings' | 'text'
    mobileTab: 'page',
    setMobileTab: (tab) => set({ mobileTab: tab }),
  };
}
