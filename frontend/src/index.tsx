import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import theme from './theme';
import AuthorizedApolloProvider from './graphql';

const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || '';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <AuthorizedApolloProvider>
        <App />
      </AuthorizedApolloProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
