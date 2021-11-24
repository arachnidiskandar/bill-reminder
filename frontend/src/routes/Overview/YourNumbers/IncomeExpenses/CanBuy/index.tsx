import {
  Box,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface CanBuyProps {
  salary: number | undefined;
  expenses: number;
}
const calculateCanBuy = (sal: number, exp: number, pri: number): number => {
  const salary = Number(sal);
  const expenses = Number(exp);
  const price = Number(pri);
  const maxAllowed = salary * 0.85;
  const potentialExpenseTotal = expenses + price;
  return (potentialExpenseTotal * 100) / maxAllowed;
};

const CalculationResult = ({ result }: { result: number }) => {
  return (
    <Box mt={4}>
      {result < 85 ? (
        <Box>
          <Text fontWeight="semibold" fontSize="large" mb={4} align="center">
            Você pode Realizar essa compra
          </Text>
          <Text>
            O orçamento ficaria comprimetido em
            <Text
              as="span"
              fontWeight="semibold"
              color="green"
              fontSize={18}
            >{` ${result.toFixed(0)}% `}</Text>
            da sua renda total após essa compra.
          </Text>
        </Box>
      ) : (
        <Box>
          <Text fontWeight="semibold" fontSize="large" mb={4} align="center">
            Não é recomendado você comprar
          </Text>
          <Text>
            O orçamento ficaria comprimetido em
            <Text
              as="span"
              fontWeight="semibold"
              color="red"
              fontSize={18}
            >{` ${result.toFixed(0)}% `}</Text>
            da sua renda total após essa compra.
          </Text>
          <Text mt={2}>
            Realize essa compra somente se for realmente necessário.
          </Text>
        </Box>
      )}
    </Box>
  );
};

const CanBuy = ({ salary, expenses }: CanBuyProps) => {
  const [buyPotentialValue, setBuyPotentialValue] = useState<number>(0);
  const [budgetPercentage, setBudgetPercentage] = useState<number>();
  const handleCanBuy = () => {
    if (salary) {
      setBudgetPercentage(calculateCanBuy(salary, expenses, buyPotentialValue));
    }
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;
    setBuyPotentialValue(value);
  };
  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="large" fontWeight="semibold">
        Posso comprar algo?
      </Text>
      <Text fontSize="smaller" color="GrayText" mb={3}>
        Digite o valor do que você deseja comprar para saber se você possui
        espaço no seu orçamento
      </Text>
      <Flex>
        <NumberInput precision={2}>
          <NumberInputField
            value={buyPotentialValue}
            onChange={handleValueChange}
          />
        </NumberInput>
        <Button colorScheme="green" ml={3} onClick={handleCanBuy}>
          Calcular
        </Button>
      </Flex>
      {budgetPercentage && <CalculationResult result={budgetPercentage} />}
    </Box>
  );
};

export default CanBuy;
