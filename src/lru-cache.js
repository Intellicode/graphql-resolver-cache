const lru = require('lru-cache');

module.exports = class LRU {
  constructor({ maxItems }) {
    this.cache = lru(maxItems);
  }

  get(key) {
    return Promise.resolve(this.cache.get(key));
  }

  set(key, value, options) {
    const { maxAge } = options || {};
    this.cache.set(key, value, maxAge);
    return Promise.resolve(key);
  }

  values() {
    return Promise.resolve(this.cache.values());
  }

  length() {
    return this.cache.length;
  }
};
