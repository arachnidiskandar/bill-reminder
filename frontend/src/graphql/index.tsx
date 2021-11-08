import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';
import useToken from '../hooks/useToken';

const AuthorizedApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useToken();

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_API,
  });

  const authLink = setContext(() => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }));

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
