import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(process.env.GRAPHQL_API, {
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    'x-hasura-role': 'admin',
  },
});

export default client;
