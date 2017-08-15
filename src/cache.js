const hash = require('object-hash');

function cache(func) {
  return (root, args, context) => {
    if (!context.resolverCache) {
      throw new Error('Missing resolverCache property on the Graphql context.');
    }

    const key = `${hash(root)}:${hash(args)}`;
    return (
      context.resolverCache
        .get(key)
        .then(result => (result ? result : func(root, args, context)))
        // Error
        .catch(() => func(root, args, context))
    );
  };
}

module.exports = cache;
