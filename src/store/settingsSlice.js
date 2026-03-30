// settings slice: updateSetting and noise seed
import { DEFAULT_SETTINGS } from './defaults.js';

export function createSettingsSlice(set) {
  return {
    settings: { ...DEFAULT_SETTINGS },

    updateSetting: (key, value) =>
      set((s) => ({ settings: { ...s.settings, [key]: value } })),

    resetSettings: () =>
      set({ settings: { ...DEFAULT_SETTINGS } }),

    // incrementing noiseSeed triggers a re-render of all noise-dependent output
    noiseSeed: 42,
    regenerateNoise: () =>
      set((s) => ({ noiseSeed: s.noiseSeed + 1 })),
  };
}
