// 8. Performance Test Scenarios
// This section can be implemented in a separate file

const axios = require('axios');
const { performance } = require('perf_hooks');

async function runPerformanceTests() {
  const results = {
    withoutCache: [],
    withCache: []
  };

  const testUserIds = Array.from({ length: 10 }, (_, i) => i + 1);

  // First test: Without cache(by clearing it)
  await axios.post('http://localhost:3000/api/cache/clear');

  for (const userId of testUserIds) {
    const start = performance.now();
    await axios.get(`http://localhost:3000/api/users/${userId}`);
    const end = performance.now();
    results.withoutCache.push(end - start);
  }

  // Second test: With cache(warmed up cache)
  for (const userId of testUserIds) {
    const start = performance.now();
    await axios.get(`http://localhost:3000/api/users/${userId}`);
    const end = performance.now();
    results.withCache.push(end - start);
  }

  // Calculate average response times
  const avgWithoutCache = results.withoutCache.reduce((a, b) => a + b, 0) / results.withoutCache.length;
  const avgWithCache = results.withCache.reduce((a, b) => a + b, 0) / results.withCache.length;

  console.log(`Average response time without cache: ${avgWithoutCache.toFixed(2)}ms`);
  console.log(`Average response time with cache: ${avgWithCache.toFixed(2)}ms`);
  console.log(`Performance improvement: ${((avgWithoutCache - avgWithCache) / avgWithoutCache * 100).toFixed(2)}%`);

  return {
    withoutCache: {
      times: results.withoutCache,
      average: avgWithoutCache
    },
    withCache: {
      times: results.withCache,
      average: avgWithCache
    },
    improvement: ((avgWithoutCache - avgWithCache) / avgWithoutCache * 100).toFixed(2) + '%'
  };
}

runPerformanceTests().then(console.log);
