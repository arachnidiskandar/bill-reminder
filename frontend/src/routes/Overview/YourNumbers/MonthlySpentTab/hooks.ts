import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { StringifyOptions } from 'querystring';
import React, { useEffect, useState } from 'react';
import { groupBy } from '../../../../helpers/groupBy';

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
  category: StringifyOptions;
  billValue: number;
  id: string;
  billName: string;
}

interface ResponseBillFromMonth {
  bills: BillsListFromMonth[];
}

interface BillsGroupedByCategory {
  [key: string]: BillsListFromMonth[];
}

const getBillsThisMonth = gql`
  query GetBillsThisMonth($userId: String!) {
    bills(
      where: {
        repeatForever: { _eq: true }
        repeatType: { _eq: MONTHLY }
        userId: { _eq: $userId }
      }
    ) {
      category
      billValue
      id
      billName
    }
  }
`;

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
  const categoriesSet = new Set(bills.map(bill => bill.category));
  return Array.from(categoriesSet) as string[];
};

const calculateTotalValueByCategory = (
  categories: string[],
  billsGroupedBy: BillsGroupedByCategory
): number[] => {
  const totalByCategory = categories.map(category => {
    const bills = billsGroupedBy[category];
    return bills
      .map(bill => bill.billValue)
      .reduce((acc, current) => acc + current);
  });
  return totalByCategory;
};

const buildChartConfig = (bills: BillsListFromMonth[]): PieChartConfig => {
  const categories = getCategoriesFromBillList(bills);
  const billsGroupedByCategory = groupBy(
    bills,
    (bill: BillsListFromMonth) => bill.category
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
  const { user } = useAuth0();
  const { loading, data } = useQuery<ResponseBillFromMonth | undefined>(
    getBillsThisMonth,
    {
      variables: { userId: user?.sub },
    }
  );
  const [chartConfig, setChartConfig] = useState<PieChartConfig | null>(null);

  useEffect(() => {
    if (data?.bills && data.bills?.length > 0) {
      setChartConfig(buildChartConfig(data.bills));
    }
  }, [data]);

  return { chartConfig, loading };
};

export default useChartConfig;
