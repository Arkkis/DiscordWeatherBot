class Cache {
  constructor() {
    this.cache = [];
    this.ttl = 60000 * 5; // Time to live in milliseconds
  }

  // Add or update a value in the cache
  set(key, value) {
    const timestamp = Date.now();
    const index = this.cache.findIndex((item) => item.key === key);

    if (index === -1) {
      this.cache.push({ key, value, timestamp });
    } else {
      this.cache[index] = { key, value, timestamp };
    }
  }

  // Retrieve a value from the cache
  get(key) {
    const index = this.cache.findIndex((item) => item.key === key);
    if (index === -1) return null;

    const item = this.cache[index];
    if (Date.now() - item.timestamp > this.ttl) {
      // Remove the item if it has expired
      this.cache.splice(index, 1);
      return null;
    }

    return item.value;
  }

  // Remove an item from the cache
  delete(key) {
    const index = this.cache.findIndex((item) => item.key === key);
    if (index === -1) return;

    this.cache.splice(index, 1);
  }

  // Clear all items from the cache
  clear() {
    this.cache = [];
  }
}

export default Cache;
