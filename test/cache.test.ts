import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { MemoryCache } from "../src/config/cache.config";

describe("MemoryCache", () => {
  let store: MemoryCache;
  beforeEach(() => {
    jest.useFakeTimers();
    store = new MemoryCache(20);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("test expire key.", () => {
    const key1 = "key1";
    const key2 = "key2";
    const ttl = 2000;
    store.set(key1, "value1", ttl);
    jest.advanceTimersByTime(1000);
    expect(store.has(key1)).toBe(true);
    expect(store.has(key2)).toBe(false);
    store.set(key2, "value2", ttl);
    expect(store.has(key2)).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(store.has(key1)).toBe(false);
    expect(store.has(key2)).toBe(true);
    jest.advanceTimersByTime(1000);
    expect(store.has(key1)).toBe(false);
    expect(store.has(key2)).toBe(false);
  });
});
