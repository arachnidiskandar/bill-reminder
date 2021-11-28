import { useQuery } from '@apollo/client';
import { endOfMonth } from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useEffect, useState } from 'react';
import { groupBy } from '../../../../helpers/groupBy';
import { getBillsThisMonth } from './queries';

interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: 1;
}
interface PieChartConfig {
  labels: string[];
  datasets: ChartDataSet[];
}
interface BillsListFromMonth {
  value: number;
  bill: {
    category: string;
    billName: string;
  };
}

interface ResponseBillFromMonth {
  payments: BillsListFromMonth[];
  paymentsAggregate: { aggregate: { sum: { value: number } } };
}

interface BillsGroupedByCategory {
  [key: string]: BillsListFromMonth[];
}

const chartColors = [
  'rgba(255, 99, 132, 0.9)',
  'rgba(54, 162, 235, 0.9)',
  'rgba(255, 206, 86, 0.9)',
  'rgba(75, 192, 192, 0.9)',
  'rgba(153, 102, 255, 0.9)',
  'rgba(255, 159, 64, 0.9)',
  'rgba(0, 159, 64, 0.9)',
  'rgba(255, 0, 64, 0.9)',
  'rgba(255, 255, 0, 0.9)',
  'rgba(0, 0, 100, 0.9)',
  'rgba(100, 100, 0, 0.9)',
];

const getCategoriesFromBillList = (bills: BillsListFromMonth[]): string[] => {
  const categoriesSet = new Set(bills.map(bill => bill.bill.category));
  return Array.from(categoriesSet);
};

const calculateTotalValueByCategory = (
  categories: string[],
  billsGroupedBy: BillsGroupedByCategory
): number[] => {
  const totalByCategory = categories.map(category => {
    const bills = billsGroupedBy[category];
    return bills
      .map(bill => bill.value)
      .reduce((acc, current) => acc + current);
  });
  return totalByCategory;
};

const buildChartConfig = (bills: BillsListFromMonth[]): PieChartConfig => {
  const categories = getCategoriesFromBillList(bills);
  const billsGroupedByCategory = groupBy(
    bills,
    (bill: BillsListFromMonth) => bill.bill.category
  ) as BillsGroupedByCategory;
  const totalByCategory = calculateTotalValueByCategory(
    categories,
    billsGroupedByCategory
  );

  const config = {
    labels: categories,
    datasets: [
      {
        label: '# teste',
        data: totalByCategory,
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 1,
      },
    ],
  } as PieChartConfig;
  return config;
};

const useChartConfig = () => {
  const currentDate = new Date();
  const { loading, data } = useQuery<ResponseBillFromMonth>(getBillsThisMonth, {
    variables: {
      startDate: startOfMonth(currentDate),
      endDate: endOfMonth(currentDate),
    },
  });
  const [chartConfig, setChartConfig] = useState<PieChartConfig | null>(null);

  useEffect(() => {
    if (data?.payments && data.payments?.length > 0) {
      setChartConfig(buildChartConfig(data.payments));
    }
  }, [data]);

  return { chartConfig, loading };
};

export default useChartConfig;
