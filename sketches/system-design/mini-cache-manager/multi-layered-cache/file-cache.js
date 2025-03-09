
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 3. File-Based Secondary Cache Layer
class FileCacheLayer {
  constructor(cacheDir = './file-cache') {
    this.cacheDir = cacheDir;
    this.indexFile = path.join(cacheDir, 'index.json');
    this.index = new Map();

    // Create cache directory
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Load index
    this.loadIndex();

    // Periodic cleanup
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  loadIndex() {
    try {
      if (fs.existsSync(this.indexFile)) {
        const data = JSON.parse(fs.readFileSync(this.indexFile, 'utf8'));
        this.index = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Error loading index file:', error);
      this.index = new Map();
    }
  }

  saveIndex() {
    try {
      const data = Object.fromEntries(this.index);
      fs.writeFileSync(this.indexFile, JSON.stringify(data), 'utf8');
    } catch (error) {
      console.error('Error saving index file:', error);
    }
  }

  async get(key) {
    const item = this.index.get(key);

    if (!item) {
      return null;
    }

    // TTL check
    if (item.expiresAt < Date.now()) {
      await this.delete(key);
      return null;
    }

    try {
      const filepath = path.join(this.cacheDir, item.filename);
      if (fs.existsSync(filepath)) {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        return data;
      }
    } catch (error) {
      console.error(`Error reading data from file: ${key}`, error);
      await this.delete(key);
    }

    return null;
  }

  async set(key, value, ttlMs = 3600000) { // Default: 1 hour
    // Create hash for filename
    const filename = `${crypto.createHash('md5').update(key).digest('hex')}.json`;
    const filepath = path.join(this.cacheDir, filename);

    // Save value to file
    fs.writeFileSync(filepath, JSON.stringify(value), 'utf8');

    // Update index
    const expiresAt = Date.now() + ttlMs;
    this.index.set(key, { filename, expiresAt });
    this.saveIndex();
  }

  async getAllKeys() {
    return Array.from(this.index.keys());
  }

  async delete(key) {
    const item = this.index.get(key);
    if (item) {
      try {
        const filepath = path.join(this.cacheDir, item.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (error) {
        console.error(`Error deleting file: ${key}`, error);
      }

      this.index.delete(key);
      this.saveIndex();
    }
  }

  async clear() {
    for (const [key, item] of this.index.entries()) {
      try {
        const filepath = path.join(this.cacheDir, item.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (error) {
        console.error(`Error cleaning up file: ${key}`, error);
      }
    }

    this.index.clear();
    this.saveIndex();
  }

  // Cleanup expired items
  async cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    // Identify expired items
    for (const [key, item] of this.index.entries()) {
      if (item.expiresAt < now) {
        expiredKeys.push(key);
      }
    }

    // Delete expired items
    for (const key of expiredKeys) {
      await this.delete(key);
    }

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired file cache items.`);
    }
  }
}

module.exports = FileCacheLayer;
