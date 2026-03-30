// IndexedDB wrapper: CRUD for pages, meta, and fonts stores
const DB_NAME     = 'text-to-handwriting';
const DB_VERSION  = 1;
const PAGES_STORE = 'pages';
const META_STORE  = 'meta';
const FONTS_STORE = 'fonts';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PAGES_STORE)) db.createObjectStore(PAGES_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(META_STORE))  db.createObjectStore(META_STORE,  { keyPath: 'key' });
      if (!db.objectStoreNames.contains(FONTS_STORE)) db.createObjectStore(FONTS_STORE, { keyPath: 'name' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function dbGet(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function dbPut(store, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).put(value);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

async function dbDelete(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

async function dbGetAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export const savePage       = (page) => dbPut(PAGES_STORE, page);
export const getPage        = (id)   => dbGet(PAGES_STORE, id);
export const deletePage     = (id)   => dbDelete(PAGES_STORE, id);
export const getAllPages     = ()     => dbGetAll(PAGES_STORE);

export const saveMeta       = (key, data) => dbPut(META_STORE, { key, ...data });
export const getMeta        = (key)       => dbGet(META_STORE, key);

export const saveCustomFont   = (font) => dbPut(FONTS_STORE, font);
export const getCustomFont    = (name) => dbGet(FONTS_STORE, name);
export const getAllCustomFonts = ()     => dbGetAll(FONTS_STORE);
export const deleteCustomFont = (name) => dbDelete(FONTS_STORE, name);
