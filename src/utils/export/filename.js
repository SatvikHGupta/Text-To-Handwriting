// Generates the export filename from font name and page number
// Format: FontName.hndtotxt[pageNum].ext

export function buildFileName(fontFamily, pageNumber, extension) {
  const cleanFont = fontFamily
    .replace(/^HND_/, '')           // strip custom font prefix
    .replace(/^Custom_/, '')        // strip alternate prefix
    .replace(/_/g, ' ')             // underscores to spaces
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '') // keep only alphanumeric and spaces
    .replace(/\s+/g, '-');          // spaces to dashes

  const pageStr = pageNumber != null ? String(pageNumber) : '';
  return `${cleanFont}.hndtotxt${pageStr}.${extension}`;
}
