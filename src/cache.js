const hash = require('object-hash');

const toSafeObject = obj => JSON.parse(JSON.stringify(obj || {}));

function cache(func, options) {
  return (root, args, context) => {
    if (!context.resolverCache) {
      throw new Error('Missing resolverCache property on the Graphql context.');
    }

    const key = `${hash(func)}:${hash(toSafeObject(root))}:${hash(toSafeObject(args))}`;
    const executeAndCache = () =>
      Promise.resolve(func(root, args, context)).then((value) => {
        context.resolverCache.set(key, value, options);
        return value;
      });

    return (
      context.resolverCache
        .get(key)
        .then(value => (value ? value : executeAndCache()))
        // Error
        .catch(() => executeAndCache())
    );
  };
}

module.exports = cache;
