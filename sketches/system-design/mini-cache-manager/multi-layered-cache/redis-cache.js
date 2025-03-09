const Redis = require('ioredis');

// 4. Redis Distributed Cache Layer
class RedisCache {
  constructor(options = {}, prefix = 'cache:') {
    this.client = new Redis(options);
    this.prefix = prefix;
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  async get(key) {
    const redisKey = this.getKey(key);
    const value = await this.client.get(redisKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing data from Redis: ${key}`, error);
      return null;
    }
  }

  async set(key, value, ttlMs = 86400000) { // Default: 1 day
    const redisKey = this.getKey(key);
    const serializedValue = JSON.stringify(value);

    if (ttlMs > 0) {
      await this.client.set(redisKey, serializedValue, 'PX', ttlMs);
    } else {
      await this.client.set(redisKey, serializedValue);
    }
  }

  async getAllKeys(pattern = '*') {
    const redisPattern = this.getKey(pattern);
    const keys = await this.client.keys(redisPattern);

    return keys.map(key => key.replace(this.prefix, ''));
  }

  async delete(key) {
    const redisKey = this.getKey(key);
    await this.client.del(redisKey);
  }

  async clear(pattern = '*') {
    const redisPattern = this.getKey(pattern);
    const keys = await this.client.keys(redisPattern);

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // Close Redis connection
  async close() {
    await this.client.quit();
  }
}

module.exports = RedisCache;
