import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from '@chakra-ui/react';

import React from 'react';
import MonthlySpentTab from './MonthlySpentTab';
import SpendForecastTab from './SpendForecast';

const YourNumbers = () => {
  return (
    <div>
      <Text fontSize="3xl">Seus números</Text>
      <Tabs mt={2} isLazy>
        <TabList>
          <Tab>Gastos do Mês Atual</Tab>
          <Tab>Previsão de Gastos</Tab>
          <Tab>Histórico de Gastos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <MonthlySpentTab />
          </TabPanel>
          <TabPanel>
            <SpendForecastTab />
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default YourNumbers;
