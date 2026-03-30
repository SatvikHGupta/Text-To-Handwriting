// fonts slice: manages builtin, local, and custom uploaded fonts
import { BUILTIN_FONTS, LOCAL_FONTS, loadCustomFont, registerLocalFonts } from '../utils/fonts.js';
import { saveCustomFont, getAllCustomFonts, deleteCustomFont as idbDeleteFont } from '../utils/idb.js';

export function createFontsSlice(set, get) {
  return {
    fonts: [
      ...BUILTIN_FONTS,
      ...LOCAL_FONTS.map((f) => ({ name: f.name, family: f.family, category: 'local' })),
    ],

    addCustomFont: (font) => {
      set((s) => {
        if (s.fonts.some((f) => f.name === font.name)) return s;
        return { fonts: [...s.fonts, font] };
      });
    },

    removeCustomFont: (name) => {
      set((s) => ({
        fonts: s.fonts.filter((f) => f.name !== name),
        settings:
          s.settings.fontFamily === s.fonts.find((f) => f.name === name)?.family
            ? { ...s.settings, fontFamily: 'Caveat' }
            : s.settings,
      }));
    },

    loadFontsFromDB: async () => {
      registerLocalFonts();

      const savedFonts = await getAllCustomFonts();
      if (!savedFonts || savedFonts.length === 0) return;

      const currentFonts = get().fonts;
      for (const font of savedFonts) {
        if (currentFonts.some((f) => f.name === font.name)) continue;
        try {
          const family = loadCustomFont(font.name, font.dataUrl);
          get().addCustomFont({ name: font.name, family, category: 'custom' });
        } catch (e) {
          console.warn('Failed to restore font:', font.name);
        }
      }
    },
  };
}
