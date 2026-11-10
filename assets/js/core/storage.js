// localStorage wrapper that never throws (private mode, blocked storage, etc.).

export const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* preference simply won't persist */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};
