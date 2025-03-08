class Cache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key]
  }

  set(key, value) {
    this.cache[key] = value;
  }

  clear() {
    this.cache = {};
  }

  remove(key) {
    delete this.cache[key];
  }

  print() {
    console.log(this.cache);
  }
}

const cache = new Cache();
cache.set('name', 'John');
cache.set("job", "Software Engineer");
cache.set("age", 25);
cache.set("city", "New York");
cache.print(); // { name: 'John', job: 'Software Engineer', age: 25, city: 'New York' }j
cache.set('age', 30);
const output = cache.get('name');
console.log('output >>', output); // John
cache.remove('age');
cache.print(); // { name: 'John' }
cache.clear();
cache.print(); // {}
