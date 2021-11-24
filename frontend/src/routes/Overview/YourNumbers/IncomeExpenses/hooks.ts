import { gql, useQuery } from '@apollo/client';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useEffect, useState } from 'react';

const getSalary = gql`
  query getSalary {
    Users {
      salary
    }
  }
`;

const getExpensesFromThisMonth = gql`
  query getExpensesFromThisMonth($startDate: date, $endDate: date) {
    paymentsAggregate(where: { date: { _gte: $startDate, _lte: $endDate } }) {
      aggregate {
        sum {
          value
        }
      }
    }
  }
`;

interface GetSalaryResponse {
  Users: [{ salary: number }];
}
interface GetExpensesResponse {
  paymentsAggregate: { aggregate: { sum: { value: number } } };
}

export const useIncomeExpenses = () => {
  const { data } = useQuery<GetSalaryResponse>(getSalary);
  const { data: expensesResponse } = useQuery<GetExpensesResponse>(
    getExpensesFromThisMonth,
    {
      variables: {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      },
    }
  );
  const [salary, setSalary] = useState<number | undefined>();
  const [expenses, setExpenses] = useState<number>(0);

  useEffect(() => {
    if (data?.Users) {
      setSalary(data.Users[0].salary);
    }
  }, [data]);

  useEffect(() => {
    if (expensesResponse?.paymentsAggregate) {
      setExpenses(expensesResponse.paymentsAggregate.aggregate.sum.value);
    }
  }, [expensesResponse]);
  return { salary, expenses, setSalary };
};
