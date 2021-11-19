import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import {
  addMonths,
  eachMonthOfInterval,
  isBefore,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { endOfMonth, isAfter } from 'date-fns/esm';
import { StringifyOptions } from 'querystring';
import React, { useEffect, useMemo, useState } from 'react';
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
interface UpcomingBill {
  value: number;
  date: Date;
  billId: string;
  Bill: {
    category: string;
  };
}

interface ResponseUpcomingBills {
  Payments: UpcomingBill[];
}

interface BillsGroupedByCategory {
  [key: string]: UpcomingBill[];
}

const getUpcomingBills = gql`
  query getUpcomingBills($startDate: date, $endDate: date) {
    Payments(
      where: {
        Bill: { repeatForever: { _eq: true }, repeatType: { _eq: MONTHLY } }
        date: { _gt: $startDate, _lte: $endDate }
      }
    ) {
      value
      billId
      Bill {
        category
      }
      date
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

const getCategoriesFromBillList = (bills: UpcomingBill[]): string[] => {
  const categoriesSet = new Set(bills.map(bill => bill.Bill.category));
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

const buildChartConfig = (bills: UpcomingBill[]): PieChartConfig => {
  const categories = getCategoriesFromBillList(bills);
  const billsGroupedByCategory = groupBy(
    bills,
    (bill: UpcomingBill) => bill.Bill.category
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

const filterBillsList = (
  bills: UpcomingBill[],
  dateToFilter: Date
): UpcomingBill[] => {
  return bills.filter(bill => {
    const billDate = new Date(bill.date);
    return (
      isAfter(billDate, startOfDay(dateToFilter)) &&
      isBefore(billDate, endOfMonth(dateToFilter))
    );
  });
};

const getDatesSixMonthsFromNow = (start: Date, end: Date) =>
  eachMonthOfInterval({
    start,
    end,
  });

export const getMonthName = (date: Date, type: 'long' | 'short') =>
  date.toLocaleString('pt-BR', { month: type });

const useChartConfig = () => {
  const startMonthDate = addMonths(startOfMonth(new Date()), 1);
  const endDateSixMonthsFromNow = addMonths(startOfMonth(new Date()), 7);
  // TODO: INFINITE LOOP PUTTING THIS ON ARRAY OF DEPENDENCIES
  const dateRangeListFilter = getDatesSixMonthsFromNow(
    startMonthDate,
    endDateSixMonthsFromNow
  );

  const { user } = useAuth0();
  const [monthFilter, setMonthFilter] = useState<number | null>(0);
  const [filteredBills, setFilteredBills] = useState<UpcomingBill[]>([]);
  const { loading, data } = useQuery<ResponseUpcomingBills | undefined>(
    getUpcomingBills,
    {
      variables: {
        userId: user?.sub,
        startDate: startMonthDate,
        endDate: endDateSixMonthsFromNow,
      },
    }
  );
  const [chartConfig, setChartConfig] = useState<PieChartConfig | null>(null);

  useEffect(() => {
    if (data?.Payments && data.Payments?.length > 0) {
      const billsList =
        typeof monthFilter === 'number'
          ? filterBillsList(data.Payments, dateRangeListFilter[monthFilter])
          : data.Payments;
      console.log(billsList);
      setFilteredBills(billsList);
    }
  }, [data, monthFilter]);

  useEffect(() => {
    setChartConfig(buildChartConfig(filteredBills));
  }, [filteredBills]);

  return { chartConfig, loading, data, setMonthFilter, dateRangeListFilter };
};

export default useChartConfig;
