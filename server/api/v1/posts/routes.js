const Posts = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getFeed(
        {},
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
          sort: request.query.sort,
        }
      )
    })
    .get('/posts/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      try {
        return await Posts.get(
          {
            _id: request.params.id,
          },
          {
            db: fastify.mongo.db,
            as: request.query.as,
          }
        )
      } catch (err) {
        reply.type('application/json').code(err.code)
        return err
      }
    })
    .get('/posts/:id/replies', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getFeed(
        {
          parent_id: request.params.id,
        },
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
          sort: request.query.sort,
        }
      )
    })
    .get('/posts/:id/favorites', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getFavorites(
        {
          post_id: request.params.id,
        },
        {
          db: fastify.mongo.db,
        }
      )
    })
    .get('/users/@:username/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.getUserFeed(
        {
          username: request.params.username,
        },
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })
    .get('/search/:query', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.searchQuery(
        { query: request.params.query },
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })
    .get('/hashtags/:hashtag', async (request, reply) => {
      reply.type('application/json').code(200)
      return await Posts.searchHashtag(
        { query: request.params.hashtag },
        {
          db: fastify.mongo.db,
          as: request.query.as,
          since: request.query.since,
          limit: request.query.limit,
        }
      )
    })

  fastify.post('/posts', async (request, reply) => {
    reply.type('application/json').code(201)
    return await Posts.add(
      {
        text: request.body.text,
        user_id: request.body.userId,
        parent_id: request.body.postId,
      },
      {
        db: fastify.mongo.db,
      }
    )
  })

  next()
}
