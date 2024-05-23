interface CacheEntry {
  value: string;
  expiresAt: number;
}

export interface NearCache {
  set(key: string, value: string, ttl: number): void;
  delete(key: string): void;
  has(key: string): boolean;
}

export class MemoryCache implements NearCache {
  private store: Map<string, CacheEntry> = new Map();
  private timer: NodeJS.Timeout | undefined;
  constructor(intervalOfMs: number = 60 * 1000) {
    this._initCleanup(intervalOfMs);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  set(key: string, value: string, ttl: number): void {
    if (ttl <= 0) {
      return;
    }
    const expiresAt = Date.now() + ttl;
    this.store.set(key, { value, expiresAt });
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  _initCleanup(intervalOfMs: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.expiresAt <= now) {
          this.delete(key);
        }
      }
    }, intervalOfMs);
  }
}
