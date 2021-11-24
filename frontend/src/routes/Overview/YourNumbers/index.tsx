import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react';

import React from 'react';
import IncomeExpenses from './IncomeExpenses';
import MonthlySpentTab from './MonthlySpentTab';
import SpendForecastTab from './SpendForecast';

const YourNumbers = () => {
  return (
    <div>
      <Text fontSize="3xl" fontWeight="semibold">
        Seus Dados Financeiros
      </Text>
      <IncomeExpenses />
      <Tabs mt={2} isLazy colorScheme="green">
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
            <SpendForecastTab future />
          </TabPanel>
          <TabPanel>
            <SpendForecastTab future={false} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default YourNumbers;
