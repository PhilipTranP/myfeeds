const Users = require('.')

module.exports = (fastify, opts, next) => {
  fastify
    .get('/users/:id', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getById(request.params.id)
    })
    .get('/users/@:username', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getByUsername(request.params.username)
    })
    .get('/users/email/:email', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getByEmail(request.params.email)
    })
    .get('/users/:id/public', async (request, reply) => {
      reply.type('application/json').code(200)
      return Users.getPublicById(request.params.id)
    })
    .get('/users/@:username/posts', async (request, reply) => {
      reply.type('application/json').code(200)
      return Posts.getAllByUsername(request.params.username)
    })

  next()
}
