const RedisCache = require('./redis-cache');
const InMemoryCache = require('./in-memory-cache');
const FileCacheLayer = require('./file-cache');

// 5. Multi-layer Cache Manager with TTL Strategies
class CacheManager {
  constructor(memoryCacheSize = 100, memoryCachePolicy = 'LRU') {
    this.memoryCache = new InMemoryCache(memoryCacheSize, memoryCachePolicy);
    this.fileCache = new FileCacheLayer();
    this.redisCache = new RedisCache(); // Default connection settings

    this.metrics = {
      hits: { memory: 0, file: 0, redis: 0 },
      misses: { memory: 0, file: 0, redis: 0, total: 0 },
      total: 0
    };
  }

  async get(key) {
    this.metrics.total++;

    // Layer 1: Memory Cache (fastest, smallest TTL)
    let value = await this.memoryCache.get(key);
    if (value !== null) {
      this.metrics.hits.memory++;
      return value;
    }
    this.metrics.misses.memory++;

    // Layer 2: File Cache
    value = await this.fileCache.get(key);
    if (value !== null) {
      this.metrics.hits.file++;
      // Promote found value to memory cache (cache warming)
      await this.memoryCache.set(key, value, 60000); // 1 minute TTL
      return value;
    }
    this.metrics.misses.file++;

    // Layer 3: Redis Cache
    value = await this.redisCache.get(key);
    if (value !== null) {
      this.metrics.hits.redis++;
      // Promote found value to lower caches
      await this.fileCache.set(key, value, 3600000); // 1 hour TTL
      await this.memoryCache.set(key, value, 60000); // 1 minute TTL
      return value;
    }
    this.metrics.misses.redis++;

    // Not found in any layer
    this.metrics.misses.total++;
    return null;
  }

  async set(key, value, options = {
    memory: { ttl: 60000 },        // 1 minute
    file: { ttl: 3600000 },        // 1 hour
    redis: { ttl: 86400000 }       // 1 day
  }) {
    // Save to all layers with different TTL strategies
    await Promise.all([
      this.memoryCache.set(key, value, options.memory.ttl),
      this.fileCache.set(key, value, options.file.ttl),
      this.redisCache.set(key, value, options.redis.ttl)
    ]);
  }

  async getAllKeys() {
    //return all keys
    return await Promise.all([
      this.memoryCache.getAllKeys(),
      this.fileCache.getAllKeys(),
      this.redisCache.getAllKeys()
    ])
  }

  async invalidate(key) {
    // Delete from all layers
    await Promise.all([
      this.memoryCache.delete(key),
      this.fileCache.delete(key),
      this.redisCache.delete(key)
    ]);
  }

  async clearAll() {
    // Clear all layers
    await Promise.all([
      this.memoryCache.clear(),
      this.fileCache.clear(),
      this.redisCache.clear()
    ]);

    // Reset metrics
    this.resetMetrics();
  }

  // 6. Cache Metrics Management
  getMetrics() {
    const hitRatio = this.metrics.total > 0
      ? ((this.metrics.hits.memory + this.metrics.hits.file + this.metrics.hits.redis) / this.metrics.total) * 100
      : 0;

    return {
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      total: this.metrics.total,
      hitRatio: hitRatio.toFixed(2) + '%',
      memorySize: this.memoryCache.getSize(),
      memoryMaxSize: this.memoryCache.getMaxSize()
    };
  }

  resetMetrics() {
    this.metrics = {
      hits: { memory: 0, file: 0, redis: 0 },
      misses: { memory: 0, file: 0, redis: 0, total: 0 },
      total: 0
    };
  }

  // Close connections
  async close() {
    await this.redisCache.close();
  }
}

module.exports = CacheManager;
