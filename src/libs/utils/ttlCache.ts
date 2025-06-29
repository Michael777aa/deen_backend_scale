// src/utils/ttlCache.ts
// A generic in‐memory TTL cache you can reuse anywhere:
export class TTLCache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();

  constructor(private readonly ttl: number) {}

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value;
    }
    this.store.delete(key);
    return undefined;
  }

  set(key: K, value: V): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }
}
