const Lru = require('./lru-cache');

describe('Lru', () => {
  describe('.constructor()', () => {
    it('constructs the cache properly', () => {
      const actual = new Lru({ maxItems: 10 });
      expect(actual).toMatchSnapshot();
    });
  });

  describe('.get(key)', () => {
    let instance;
    const maxItems = 10;

    beforeEach(() => {
      instance = new Lru({ maxItems });
    });

    it('returns a promise', () => {
      const actual = instance.get('key');
      expect(actual).toBeInstanceOf(Promise);
    });

    it('returns undefined when the key is not set', () => {
      expect.assertions(1);
      return instance.get('key').then(actual => expect(actual).toBeUndefined());
    });

    it('returns the correct item when the key is set', () => {
      const expected = 'hello world';
      expect.assertions(1);
      return instance
        .set('key', expected)
        .then(() => instance.get('key'))
        .then(actual => expect(actual).toEqual(expected));
    });

    it('returns undefined when the key is ejected', () => {
      const expected = 'hello world';
      const range = Array.from(new Array(maxItems), (x, i) => i);

      expect.assertions(1);

      return instance
        .set('key', expected)
        .then(() =>
          Promise.all(range.map(i => instance.set(`key${i}`, 'hello universe')))
        )
        .then(() => instance.get('key'))
        .then(actual => expect(actual).toEqual(undefined));
    });
  });

  describe('.set(key, value, options)', () => {
    let instance;
    const maxItems = 10;

    beforeEach(() => {
      instance = new Lru({ maxItems });
    });

    it('increments the item count', () => {
      expect.assertions(1);
      return instance
        .set('key', 'value')
        .then(() => expect(instance.length()).toEqual(1));
    });

    it('adheres to maxItems when more items are inserted', () => {
      const range = Array.from(new Array(maxItems + 1), (x, i) => i);

      expect.assertions(1);

      return Promise.all(
        range.map(i => instance.set(`key${i}`, 'hello universe'))
      ).then(() => expect(instance.length()).toEqual(maxItems));
    });

    it('only stores the last items in order of last insertion', () => {
      const range = Array.from(new Array(maxItems), (x, i) => i);

      expect.assertions(1);

      return instance
        .set('key', 'value')
        .then(() =>
          Promise.all(
            range.map(i => instance.set(`key${i}`, `hello universe ${i}`))
          )
        )
        .then(() => instance.values())
        .then(values =>
          expect(values).toEqual(
            range.map(i => `hello universe ${i}`).reverse()
          )
        );
    });
  });
});
