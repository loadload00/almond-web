const createStorage = (storage: Storage) => {
  return {
    get(key: string) {
      return JSON.parse(storage.getItem(key) as any)
    },
    set<T>(key: string, value: T) {
      storage.setItem(key, JSON.stringify(value))
    },
    remove(key: string) {
      storage.removeItem(key)
    },
    clear() {
      storage.clear()
    },
  }
}

export const local = createStorage(localStorage)

export const session = createStorage(sessionStorage)
