import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { addMonths } from 'date-fns';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import React from 'react';
import { getDelayedBills, getNextBills, getPaidBills } from './queries';
import BillTab from './_components/BillTab';

const YourBills = () => {
  const currentDate = new Date();
  return (
    <Box>
      <Text fontSize="3xl" fontWeight="semibold">
        Suas Contas
      </Text>
      <Tabs colorScheme="green" isLazy>
        <TabList>
          <Tab>Próximas Contas</Tab>
          <Tab>Atrasadas</Tab>
          <Tab>Não pagas</Tab>
          <Tab>Pagas</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <BillTab
              query={getNextBills}
              queryVariables={{
                startDate: startOfMonth(currentDate),
                endDate: endOfMonth(currentDate),
              }}
            />
          </TabPanel>
          <TabPanel>
            <BillTab query={getDelayedBills} />
          </TabPanel>
          <TabPanel>
            <BillTab
              query={getNextBills}
              queryVariables={{
                startDate: addMonths(startOfMonth(currentDate), 1),
                endDate: addMonths(endOfMonth(currentDate), 6),
              }}
            />
          </TabPanel>
          <TabPanel>
            <BillTab query={getPaidBills} disablePayment />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default YourBills;
