const cache = require('./cache');

describe('cache()', () => {
  const parent = { id: 1 };
  const args = { name: 'hello' };
  let cacheMock = {};

  beforeEach(() => {
    cacheMock = {
      get: jest.fn(() => Promise.resolve()),
      set: jest.fn((key, result) => Promise.resolve(result)),
    };
  });

  describe('hashing', () => {
    it('hashes the root and arguments consistently', () => {
      const resolver = cache(() => {});

      resolver(parent, args, { resolverCache: cacheMock });
      resolver(parent, args, { resolverCache: cacheMock });

      const call1Args = cacheMock.get.mock.calls[0][0];
      const call2Args = cacheMock.get.mock.calls[1][0];

      expect(call1Args).toEqual(call2Args);
    });
  });

  describe('cache behavior', () => {
    const cachedValue = 'cached';
    const uncachedValue = 'uncached';
    const resolver = cache(() => uncachedValue);

    it('returns cached value if the cache returns a value', () => {
      cacheMock.get = jest.fn(() => Promise.resolve(cachedValue));

      expect.assertions(1);

      return resolver(parent, args, {
        resolverCache: cacheMock,
      }).then(actual => {
        expect(actual).toEqual(cachedValue);
      });
    });

    it('does not re-cache cached value', () => {
      cacheMock.get = jest.fn(() => Promise.resolve(cachedValue));

      expect.assertions(1);

      return resolver(parent, args, {
        resolverCache: cacheMock,
      }).then(() => {
        expect(cacheMock.set).toHaveBeenCalledTimes(0);
      });
    });

    it('returns uncached value if the cache returns undefined', () => {
      cacheMock.get = jest.fn(() => Promise.resolve(undefined));

      expect.assertions(2);

      return resolver(parent, args, {
        resolverCache: cacheMock,
      }).then(actual => {
        expect(actual).toEqual(uncachedValue);
        expect(cacheMock.set).toHaveBeenCalledTimes(1);
      });
    });

    it('sets uncached value in cache', () => {
      cacheMock.get = jest.fn(() => Promise.resolve(undefined));

      expect.assertions(1);

      return resolver(parent, args, {
        resolverCache: cacheMock,
      }).then(() => {
        expect(cacheMock.set).toHaveBeenCalledTimes(1);
      });
    });
  });
});
