/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useColorMode, Button, Textarea } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import ApiCalendar from 'react-google-calendar-api';
import BillList from './BillList';
import useToken from '../../hooks/useToken';
import YourNumbers from './YourNumbers';

const Overview = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { token, isLoading } = useToken();

  const handleItemClick1 = (): void => {
    ApiCalendar.handleAuthClick();
  };

  const handleItemClick2 = (): void => {
    ApiCalendar.handleSignoutClick();
  };

  return (
    <>
      {isAuthenticated ? 'logado' : 'deslogado'}
      <Button onClick={() => loginWithRedirect()}>log in</Button>
      <Button onClick={() => logout()}>log out</Button>
      <Button onClick={handleItemClick1}>sign-in google</Button>
      <Button onClick={handleItemClick2}>sign-out google</Button>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      {token && <Textarea>{token}</Textarea>}
      <BillList />
      <YourNumbers />
    </>
  );
};

export default Overview;
