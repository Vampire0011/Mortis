// Small helpers around localStorage / sessionStorage. Everything is wrapped in try/catch
// because storage can be full or blocked. NOTE: this is demo storage only - not secure.
export function load(key, fallback, store = localStorage) {
  try {
    const raw = store.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
export function save(key, value, store = localStorage) {
  try {
    store.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
export function remove(key, store = localStorage) {
  try { store.removeItem(key) } catch { /* ignore */ }
}
