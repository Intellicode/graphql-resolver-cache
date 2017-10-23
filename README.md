
Graphql resolver cache
==============================

[![Greenkeeper badge](https://badges.greenkeeper.io/Intellicode/graphql-resolver-cache.svg)](https://greenkeeper.io/)

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url] [![BCH compliance][bettercode-image]][bettercode-url] 

Easy wrapper around resolvers to cache results based on root elements and Graphql query arguments. Works best with Apollo Graphql.

# Installation

```sh
$ npm install graphql-resolver-cache --save
```

# Configuration

Add a cache to your Graphql middleware:

```js
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import { LruCache } from 'graphql-resolver-cache';

const myGraphQLSchema = // ... define or import your schema here!
const PORT = 3000;

const app = express();
const resolverCache = new LruCache();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema: myGraphQLSchema,
  context: { resolverCache }
}));

app.listen(PORT);
```

Wrap your resolver in a cache function:

```js
import { withCache } from 'graphql-resolver-cache';
export default {
  User: {
    getFriends: withCache((root, args, context) => { /* logic */ }),
  },
};
```

[npm-url]: https://npmjs.org/package/graphql-resolver-cache
[npm-image]: http://img.shields.io/npm/v/graphql-resolver-cache.svg?style=flat-square

[travis-url]: https://travis-ci.org/Intellicode/graphql-resolver-cache
[travis-image]: http://img.shields.io/travis/Intellicode/graphql-resolver-cache/master.svg?style=flat-square

[deps-url]: https://david-dm.org/Intellicode/graphql-resolver-cache
[deps-image]: https://img.shields.io/david/dev/Intellicode/graphql-resolver-cache.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/Intellicode/graphql-resolver-cache?branch=master
[coverage-image]: http://img.shields.io/coveralls/Intellicode/graphql-resolver-cache/master.svg?style=flat-square

[climate-url]: https://codeclimate.com/github/Intellicode/graphql-resolver-cache
[climate-image]: http://img.shields.io/codeclimate/github/Intellicode/graphql-resolver-cache.svg?style=flat-square

[status-url]: https://github.com/Intellicode/graphql-resolver-cache/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat-square

[bettercode-image]: https://bettercodehub.com/edge/badge/Intellicode/graphql-resolver-cache
[bettercode-url]: https://bettercodehub.com

