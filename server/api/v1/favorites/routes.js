const Favorites = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .post('/favorites/create', async (request, reply) => {
      reply.type('application/json').code(201)
      return Favorites.add({
        post_id: request.body.post_id,
        user_id: request.body.user_id,
      })
    })
    .post('/favorites/delete', async (request, reply) => {
      reply.type('application/json').code(201)
      return Favorites.remove({
        post_id: request.body.post_id,
        user_id: request.body.user_id,
      })
    })

  next()
}