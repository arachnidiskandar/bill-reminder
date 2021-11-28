import { gql, useQuery } from '@apollo/client';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useEffect, useState } from 'react';

const getSalary = gql`
  query getSalary($startMonth: date, $endMonth: date) {
    userAggregate {
      aggregate {
        sum {
          salary
        }
      }
      nodes {
        additionalSalaries_aggregate(
          where: { date: { _gte: $startMonth, _lte: $endMonth } }
        ) {
          aggregate {
            sum {
              additionalSalaryValue
            }
          }
        }
      }
    }
  }
`;

const getExpensesFromThisMonth = gql`
  query getExpensesFromThisMonth($startMonth: date, $endMonth: date) {
    paymentsAggregate(where: { date: { _gte: $startMonth, _lte: $endMonth } }) {
      aggregate {
        sum {
          value
        }
      }
    }
  }
`;
interface nodeAggregate {
  // eslint-disable-next-line camelcase
  additionalSalaries_aggregate: {
    aggregate: { sum: { additionalSalaryValue: number } };
  };
}
interface GetSalaryResponse {
  userAggregate: {
    aggregate: { sum: { salary: number } };
    nodes: nodeAggregate[];
  };
}
interface GetExpensesResponse {
  paymentsAggregate: { aggregate: { sum: { value: number } } };
}

export const useIncomeExpenses = () => {
  const startMonth = startOfMonth(new Date());
  const endMonth = endOfMonth(new Date());
  const { data } = useQuery<GetSalaryResponse>(getSalary, {
    variables: {
      startMonth,
      endMonth,
    },
  });
  const { data: expensesResponse } = useQuery<GetExpensesResponse>(
    getExpensesFromThisMonth,
    {
      variables: {
        startMonth,
        endMonth,
      },
    }
  );
  const [salary, setSalary] = useState<number | undefined>();
  const [expenses, setExpenses] = useState<number>(0);

  useEffect(() => {
    if (data?.userAggregate) {
      setSalary(
        Number(data.userAggregate.aggregate.sum.salary) +
          Number(
            data.userAggregate.nodes[0].additionalSalaries_aggregate.aggregate
              .sum.additionalSalaryValue
          )
      );
    }
  }, [data]);

  useEffect(() => {
    if (expensesResponse?.paymentsAggregate) {
      setExpenses(expensesResponse.paymentsAggregate.aggregate.sum.value);
    }
  }, [expensesResponse]);
  return { salary, expenses, setSalary };
};
