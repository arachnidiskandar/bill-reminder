import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { gql } from 'graphql-request';
import jwt from 'jsonwebtoken';

import client from './graphql/client';
import hasuraRoutes from './hasura';

// Don't actually do this, read this from process.env in a real app
const JWT_EXPIRE_TIME = '3d';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/hasura', hasuraRoutes);

// This is a function which takes the URL and headers for Hasura queries
// and returns a function which sends GraphQL requests to the Hasura instance
// const makeGraphQLClient = ({ url, headers }) => async ({
//   query,
//   variables,
// }) => {
//   const request = await fetch(url, {
//     headers,
//     method: "POST",
//     body: JSON.stringify({ query, variables }),
//   })
//   return request.json()
// }

// const sendQuery = makeGraphQLClient({
//   url: HASURA_ENDPOINT,
//   headers: {
//     "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
//   },
// })

function generateJWT({ allowedRoles, defaultRole, otherClaims }) {
  const payload = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': allowedRoles,
      'x-hasura-default-role': defaultRole,
      ...otherClaims,
    },
  };
  return jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRE_TIME,
  });
}

/**
 * We will turn these REST API endpoints into Hasura Actions so that the client can call them through GraphQL queries within Hasura
 * https://hasura.io/docs/1.0/graphql/core/actions/action-handlers.html#http-handler
 *
 * To do this, we just need to define GraphQL types for:
 *  - The function's input arguments
 *  - The function's return type
 *
 * This can be done in the web console UI in Hasura, under the "Actions" tab
 */

const createUserQuery = gql`
  mutation CreateUserMutation($username: String, $password: String) {
    insert_users_one(object: { username: $username, password: $password }) {
      id
    }
  }
`;

app.post('/hasura/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Email inválid' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Senha inválida' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não são iguais' });
  }

  const hashPassword = bcrypt.hashSync(password);

  const variables = { username, password: hashPassword };

  try {
    const response = await client.request(createUserQuery, variables);
    const userId = response.insert_users_one?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    const accessToken = generateJWT({
      defaultRole: 'user',
      allowedRoles: ['user'],
      otherClaims: {
        'x-hasura-user-id': userId,
      },
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

const loginUser = gql`
  query FindUserByUsername($username: String) {
    users(where: { username: { _eq: $username } }) {
      id
      password
    }
  }
`;

app.post('/hasura/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await client.request(loginUser, { username });
    const dbUser = response.users?.[0];
    if (!dbUser) return res.status(400).json({ error: 'Usuário ou senha erradas' });

    const validPassword = bcrypt.compareSync(password, dbUser.password);
    if (!validPassword) return res.status(400).json({ error: 'Usuário ou senha erradas' });

    const accessToken = generateJWT({
      defaultRole: 'user',
      allowedRoles: ['user'],
      otherClaims: {
        'x-hasura-user-id': dbUser.id,
      },
    });
    return res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(process.env.PORT);
