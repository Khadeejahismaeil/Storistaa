// lib/library.js
// LocalStorage-backed "My Story Library". No backend — everything lives in
// the browser. Each entry keeps the structured story plus the original inputs
// so a story can be re-opened or regenerated later.

const KEY = "moontales:library:v1";
const MAX_ENTRIES = 100;

function makeId() {
  return (
    "st_" +
    Math.random().toString(36).slice(2, 9) +
    Date.now().toString(36)
  );
}

export function loadLibrary() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function persist(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch (_) {
    /* storage full or blocked — fail quietly */
  }
}

// Save a story. `entry` = { inputs, story }. Returns the stored entry.
export function saveStory(entry) {
  const stored = {
    id: makeId(),
    savedAt: Date.now(),
    childName: entry.inputs?.childName?.trim() || "",
    age: entry.inputs?.age || "",
    theme: entry.inputs?.theme || "",
    inputs: entry.inputs,
    story: entry.story, // { title, story, lesson, tomorrow }
  };
  const next = [stored, ...loadLibrary()].slice(0, MAX_ENTRIES);
  persist(next);
  return stored;
}

export function deleteStory(id) {
  const next = loadLibrary().filter((e) => e.id !== id);
  persist(next);
  return next;
}

export function clearLibrary() {
  persist([]);
  return [];
}
