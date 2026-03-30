// pages slice: CRUD, IDB persistence, and migration
import { savePage, deletePage as idbDeletePage, getAllPages, saveMeta, getMeta } from '../utils/idb.js';

export const MAX_PAGES = 30;

function makePageId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function createEmptyPage() {
  return {
    id: makePageId(),
    text: '',
    drawingDataUrl: null,
    topMarginText:   '',
    leftMarginText:  '',
    rightMarginText: '',
  };
}

export function createPagesSlice(set, get) {
  return {
    pages: [createEmptyPage()],
    currentPageIndex: 0,

    getCurrentPage: () => {
      const s = get();
      return s.pages[s.currentPageIndex] || s.pages[0];
    },

    setCurrentPage: (index) => set({ currentPageIndex: index }),

    addPage: () => set((s) => {
      if (s.pages.length >= MAX_PAGES) return s;
      const page  = createEmptyPage();
      const pages = [...s.pages, page];
      const newIndex = pages.length - 1;
      savePage(page);
      saveMeta('notebook', { pageIds: pages.map(p => p.id), currentPageIndex: newIndex });
      return { pages, currentPageIndex: newIndex };
    }),

    deletePage: (index) => set((s) => {
      if (s.pages.length <= 1) return s;
      const removed = s.pages[index];
      const pages   = s.pages.filter((_, i) => i !== index);
      const currentPageIndex = Math.min(s.currentPageIndex, pages.length - 1);
      idbDeletePage(removed.id);
      saveMeta('notebook', { pageIds: pages.map(p => p.id), currentPageIndex });
      return { pages, currentPageIndex };
    }),

    updatePageText: (text) => set((s) => {
      const pages = [...s.pages];
      const page  = { ...pages[s.currentPageIndex], text };
      pages[s.currentPageIndex] = page;
      savePage(page);
      return { pages };
    }),

    updatePageDrawing: (dataUrl) => set((s) => {
      const pages = [...s.pages];
      const page  = { ...pages[s.currentPageIndex], drawingDataUrl: dataUrl };
      pages[s.currentPageIndex] = page;
      savePage(page);
      return { pages };
    }),

    updateMarginText: (side, value) => set((s) => {
      const key   = `${side}MarginText`;
      const pages = [...s.pages];
      const page  = { ...pages[s.currentPageIndex], [key]: value };
      pages[s.currentPageIndex] = page;
      savePage(page);
      return { pages };
    }),

    loadPagesFromDB: async () => {
      const [dbPages, meta] = await Promise.all([getAllPages(), getMeta('notebook')]);
      if (!dbPages || dbPages.length === 0) return;
      let ordered = dbPages;
      if (meta?.pageIds) {
        const map = Object.fromEntries(dbPages.map(p => [p.id, p]));
        ordered   = meta.pageIds.map(id => map[id]).filter(Boolean);
        if (ordered.length === 0) ordered = dbPages;
      }
      // migrate older pages that may be missing margin text fields
      const migrated = ordered.map(p => ({
        topMarginText: '', leftMarginText: '', rightMarginText: '',
        ...p,
      }));
      const currentPageIndex = Math.min(meta?.currentPageIndex || 0, migrated.length - 1);
      set({ pages: migrated, currentPageIndex });
    },
  };
}
