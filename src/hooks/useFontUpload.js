// Hook: font file validation, IDB save, and store registration
import { useState, useRef } from 'react';
import { useStore }         from '../store.js';
import { readFontFile, loadCustomFont, fontNameFromFile } from '../utils/fonts.js';
import { saveCustomFont }   from '../utils/idb.js';

const VALID_EXTS = ['.ttf', '.otf', '.woff', '.woff2'];

export function useFontUpload(onSuccess) {
  const addCustomFont  = useStore((s) => s.addCustomFont);
  const fonts          = useStore((s) => s.fonts);
  const updateSetting  = useStore((s) => s.updateSetting);
  const fileInputRef   = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!VALID_EXTS.includes(ext)) {
      setError('Please select a .ttf, .otf, .woff, or .woff2 file');
      return;
    }

    const fontName = fontNameFromFile(file);

    if (fonts.some((f) => f.name === fontName)) {
      setError(`"${fontName}" is already uploaded.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      const dataUrl = await readFontFile(file);
      const family  = loadCustomFont(fontName, dataUrl);
      await saveCustomFont({ name: fontName, family, dataUrl, category: 'custom' });
      addCustomFont({ name: fontName, family, category: 'custom' });
      updateSetting('fontFamily', family);
      onSuccess?.();
    } catch (err) {
      setError('Failed to load font: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return { fileInputRef, uploading, error, handleFileChange, openFilePicker: () => fileInputRef.current?.click() };
}
