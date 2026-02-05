/**
 * In-memory store for localStorage-like data (main process).
 * Used by renderer via IPC.
 */
export type LocalStorageData = Record<string, string>

class LocalStorageService {
  private store: LocalStorageData = {}

  setItem(key: string, value: string): LocalStorageData {
    this.store[key] = value
    return { ...this.store }
  }

  getStore(): LocalStorageData {
    return { ...this.store }
  }
}

export const localStorageService = new LocalStorageService()
