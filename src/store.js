// Zustand store: merges all slices and persists to localStorage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSettingsSlice } from './store/settingsSlice.js';
import { createPagesSlice }    from './store/pagesSlice.js';
import { createFontsSlice }    from './store/fontsSlice.js';
import { createDrawingSlice }  from './store/drawingSlice.js';
import { createUISlice }       from './store/uiSlice.js';

export { MAX_PAGES }        from './store/pagesSlice.js';
export { DEFAULT_SETTINGS } from './store/defaults.js';

export const useStore = create(
  persist(
    (set, get) => ({
      ...createSettingsSlice(set, get),
      ...createPagesSlice(set, get),
      ...createFontsSlice(set, get),
      ...createDrawingSlice(set, get),
      ...createUISlice(set, get),

      loadFromDB: async () => {
        await Promise.all([get().loadPagesFromDB(), get().loadFontsFromDB()]);
      },
    }),
    {
      name: 'handwriting-settings',
      partialize: (s) => ({
        settings:         s.settings,
        drawingColor:     s.drawingColor,
        drawingLineWidth: s.drawingLineWidth,
        sidebarOpen:      s.sidebarOpen,
        darkMode:         s.darkMode,
        zoom:             s.zoom,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
