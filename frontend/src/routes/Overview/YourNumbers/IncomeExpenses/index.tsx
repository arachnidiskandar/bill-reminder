import { Box, Grid, Text } from '@chakra-ui/react';

import React from 'react';
import CanBuy from './CanBuy';
import { useIncomeExpenses } from './hooks';
import SalaryPopover from './SalaryPopover';

const IncomeExpenses = () => {
  const { expenses, salary, setSalary } = useIncomeExpenses();

  return (
    <>
      <Grid mt={4} templateColumns="repeat(2, 1fr)" gap={4}>
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text>O seu salário</Text>
          {salary ? (
            <Text mt={2} fontSize="xl" fontWeight="semibold" color="green">
              {`R$ ${salary.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
            </Text>
          ) : (
            <SalaryPopover setSalaryCb={setSalary} />
          )}
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text>Despesas desse mês</Text>
          <Text mt={2} fontSize="xl" fontWeight="semibold" color="red">
            {`R$ ${expenses.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}
          </Text>
        </Box>
      </Grid>
      <CanBuy salary={salary} expenses={expenses} />
    </>
  );
};

export default IncomeExpenses;
