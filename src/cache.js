const hash = require('object-hash');

function cache(func, options) {
  return (root, args, context) => {
    if (!context.resolverCache) {
      throw new Error('Missing resolverCache property on the Graphql context.');
    }

    const key = `${hash(root)}:${hash(args)}`;
    const executeAndCache = () =>
      Promise.resolve(func(root, args, context)).then(value =>
        context.resolverCache.set(key, value, options)
      );

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
