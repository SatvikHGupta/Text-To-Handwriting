# Fonts Directory

This folder is for self-hosted font files.

## How to add fonts here

1. Place your `.ttf`, `.otf`, `.woff`, or `.woff2` font files in this directory
2. Register them in `src/utils/fonts.js` by adding to the `BUILTIN_FONTS` array
3. Add a `@font-face` declaration in `index.html` or `src/index.css`

Example `@font-face`:
```css
@font-face {
  font-family: 'MyHandwriting';
  src: url('/fonts/my-handwriting.woff2') format('woff2');
  font-display: swap;
}
```

## Currently loaded fonts

All 15 built-in fonts are loaded from **Google Fonts CDN** via the `<link>` tag in `index.html`.
If you want to self-host them for offline use, download the font files and place them here.

## User-uploaded fonts

When users upload custom fonts via the Font Picker, they are stored as base64 data URLs
in the browser's IndexedDB , not in this folder. They persist across page refreshes
but are specific to the user's browser.
