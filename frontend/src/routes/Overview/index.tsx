/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useColorMode, Button, Textarea } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import ApiCalendar from 'react-google-calendar-api';
import BillList from './BillList';
import useToken from '../../hooks/useToken';

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

  const eventFromNow = {
    summary: 'Test',
    description: "A chance to hear more about Google's developer products.",
    start: {
      date: '2021-11-06',
    },
    end: {
      date: '2021-11-06',
    },
    recurrence: ['RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=6'],
  };

  const handleCreateEvent = async () => {
    try {
      const createdEvent = await ApiCalendar.createEvent(eventFromNow);
      console.log(createdEvent);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {isAuthenticated ? 'logado' : 'deslogado'}
      <Button onClick={() => loginWithRedirect()}>log in</Button>
      <Button onClick={() => logout()}>log out</Button>
      <Button onClick={handleItemClick1}>sign-in google</Button>
      <Button onClick={handleItemClick2}>sign-out google</Button>
      <Button onClick={handleCreateEvent}>criar evento</Button>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
      {token && <Textarea>{token}</Textarea>}
      <BillList />
    </>
  );
};

export default Overview;
