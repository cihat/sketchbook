// 1. Create a Simple HTTP API
const express = require('express');

const CacheManager = require('./cache-manager');

const app = express();
const PORT = 3000;

// Database simulation (in a real application, a database would be used)
const dummyDatabase = {
  getUser: async (id) => {
    // Simulating database query - artificially slow
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      createdAt: new Date().toISOString()
    };
  },

  getProduct: async (id) => {
    // Database query simulation
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: `Product ${id}`,
      price: Math.floor(Math.random() * 1000) + 1,
      stock: Math.floor(Math.random() * 100)
    };
  }
};


// Create cache manager instance
const cacheManager = new CacheManager(
  100, // Memory cache size
  'LRU' // Memory cache policy
);

// API routes
app.get('/api/users', async (req, res) => {
  try {
    res.json({
      data: await cacheManager.getAllKeys(),
    })
  } catch (error) {
    console.error(`Error getting user data: ${userId}`, error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;

  try {
    // Look in cache
    let userData = await cacheManager.get(cacheKey);
    let source = 'cache';

    // If not in cache, get from database
    if (!userData) {
      userData = await dummyDatabase.getUser(userId);
      source = 'database';

      // Cache the data retrieved from database
      if (userData) {
        await cacheManager.set(cacheKey, userData, {
          memory: { ttl: 60000 },       // 1 minute
          file: { ttl: 300000 },        // 5 minutes
          redis: { ttl: 3600000 }       // 1 hour
        });
      }
    }

    res.json({
      data: userData,
      source,
      cacheMetrics: cacheManager.getMetrics()
    });
  } catch (error) {
    console.error(`Error getting user data: ${userId}`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const cacheKey = `product:${productId}`;

  try {
    // Look in cache
    let productData = await cacheManager.get(cacheKey);
    let source = 'cache';

    // If not in cache, get from database
    if (!productData) {
      productData = await dummyDatabase.getProduct(productId);
      source = 'database';

      // Cache the data retrieved from database
      if (productData) {
        await cacheManager.set(cacheKey, productData, {
          memory: { ttl: 30000 },        // 30 seconds
          file: { ttl: 120000 },         // 2 minutes
          redis: { ttl: 1800000 }        // 30 minutes
        });
      }
    }

    res.json({
      data: productData,
      source,
      cacheMetrics: cacheManager.getMetrics()
    });
  } catch (error) {
    console.error(`Error getting product data: ${productId}`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cache management routes
app.post('/api/cache/clear', async (req, res) => {
  try {
    await cacheManager.clearAll();
    res.json({ message: 'All caches cleared', metrics: cacheManager.getMetrics() });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cache/metrics', (req, res) => {
  res.json(cacheManager.getMetrics());
});

// Start application
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Close connections when application shuts down
process.on('SIGINT', async () => {
  console.log('Application shutting down...');
  await cacheManager.close();
  process.exit(0);
});
