const { ApolloServer } = require('@apollo/server');
const { GraphQLError } = require('graphql');
const { expressMiddleware } = require('@apollo/server/express4');
const { schema } = require('./config');

let middleware = null;

const getGraphqlMiddleware = async () => {
  if (middleware) {
    return middleware;
  }

  const apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer.start();
  middleware = expressMiddleware(apolloServer, {
    context: ({ req }) => {
      const userId = req.get('x-user-id');
      delete req.user;
      if (userId) {
        return {
          user: {
            id: userId,
          },
        };
      } else {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
            http: {
              status: 401,
            },
          },
        });
      }
    },
  });

  return middleware;
};

module.exports = {
  getGraphqlMiddleware,
};
