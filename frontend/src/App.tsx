import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Overview from './routes/Overview';
import theme from './theme';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Box p={4}>
            <Route path="/" component={Overview} />
          </Box>
        </Switch>
      </Router>
    </ChakraProvider>
  );
};

export default App;
