jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key: string, value: string) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      getItem: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      removeItem: jest.fn((key: string) => {
        store.delete(key);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Array.from(store.keys()))),
      multiGet: jest.fn((keys: readonly string[]) =>
        Promise.resolve(keys.map(k => [k, store.get(k) ?? null] as [string, string | null])),
      ),
      multiSet: jest.fn((pairs: Iterable<readonly [string, string]>) => {
        for (const [k, v] of pairs) {
          store.set(k, v);
        }
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: readonly string[]) => {
        keys.forEach(k => store.delete(k));
        return Promise.resolve();
      }),
    },
  };
});
