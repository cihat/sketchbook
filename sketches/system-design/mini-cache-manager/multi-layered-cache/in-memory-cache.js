
// 2. In-Memory Cache Layer
class InMemoryCache {
  constructor(maxSize = 100, policy = 'LRU') {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.policy = policy;
    this.usage = new Map(); // For LFU usage count
    this.insertionOrder = []; // For FIFO ordering
  }

  async get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // TTL check
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.usage.delete(key);
      this.insertionOrder = this.insertionOrder.filter(k => k !== key);
      return null;
    }

    // Update usage info for LRU and LFU
    if (this.policy === 'LRU') {
      // Move to end of recently used list
      this.insertionOrder = this.insertionOrder.filter(k => k !== key);
      this.insertionOrder.push(key);
    } else if (this.policy === 'LFU') {
      // Increase usage frequency
      this.usage.set(key, (this.usage.get(key) || 0) + 1);
    }

    return item.value;
  }

  async set(key, value, ttlMs = 60000) {
    // Check if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });

    // Update metadata for the relevant policy
    if (this.policy === 'LRU' || this.policy === 'FIFO') {
      if (!this.insertionOrder.includes(key)) {
        this.insertionOrder.push(key);
      } else if (this.policy === 'LRU') {
        // For LRU, remove existing item from list and add to end
        this.insertionOrder = this.insertionOrder.filter(k => k !== key);
        this.insertionOrder.push(key);
      }
    } else if (this.policy === 'LFU') {
      // Initialize or increment usage counter for new item
      this.usage.set(key, (this.usage.get(key) || 0) + 1);
    }
  }

  async getAllKeys() {
    return Array.from(this.cache.keys());
  }

  async delete(key) {
    this.cache.delete(key);
    this.usage.delete(key);
    this.insertionOrder = this.insertionOrder.filter(k => k !== key);
  }

  async clear() {
    this.cache.clear();
    this.usage.clear();
    this.insertionOrder = [];
  }

  // Implement eviction strategy based on policy
  evict() {
    let keyToEvict = null;

    if (this.policy === 'FIFO') {
      // Remove first item
      keyToEvict = this.insertionOrder.shift() || null;
    } else if (this.policy === 'LRU') {
      // Remove least recently used item (at beginning of list)
      keyToEvict = this.insertionOrder.shift() || null;
    } else if (this.policy === 'LFU') {
      // Remove least frequently used item
      let minUsage = Infinity;
      for (const [key, count] of this.usage.entries()) {
        if (count < minUsage && this.cache.has(key)) {
          minUsage = count;
          keyToEvict = key;
        }
      }
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.usage.delete(keyToEvict);
    }
  }

  // Helper methods for metrics
  getSize() {
    return this.cache.size;
  }

  getMaxSize() {
    return this.maxSize;
  }
}

module.exports = InMemoryCache;
