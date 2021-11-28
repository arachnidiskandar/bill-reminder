import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, IconButton, Text } from '@chakra-ui/react';

import React from 'react';
import AdditionalMoneyPopover from './AdditionalMoneyPopover';
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
            <>
              <Flex alignItems="center">
                <Text mt={2} fontSize="xl" fontWeight="semibold" color="green">
                  {`R$ ${salary.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`}
                </Text>
                <SalaryPopover
                  setSalaryCb={setSalary}
                  triggerElement={
                    <IconButton
                      aria-label="Edit Salary"
                      mt={2}
                      ml={3}
                      size="xs"
                      icon={<EditIcon />}
                      colorScheme="green"
                    />
                  }
                />
              </Flex>
              <AdditionalMoneyPopover
                setSalaryCb={setSalary}
                triggerElement={
                  <Box>
                    <Button
                      w="100%"
                      size="sm"
                      mt={3}
                      colorScheme="green"
                      leftIcon={<AddIcon />}
                    >
                      Renda Extra
                    </Button>
                  </Box>
                }
              />
            </>
          ) : (
            <SalaryPopover
              setSalaryCb={setSalary}
              triggerElement={
                <Button
                  mt={2}
                  size="sm"
                  leftIcon={<AddIcon />}
                  colorScheme="green"
                >
                  Cadastrar salário
                </Button>
              }
            />
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
