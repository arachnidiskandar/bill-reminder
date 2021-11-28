import { gql, useQuery } from '@apollo/client';
import { addMonths, eachMonthOfInterval, startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns/esm';
import { useEffect } from 'react';
import { getMonthName } from '../../../../helpers/DateHelpers';
import { groupBy } from '../../../../helpers/groupBy';
import useChartStore, { filterBillsList } from './chartStore';
import {
  BillsGroupedByCategory,
  ChartConfig,
  ChartState,
  ResponseUpcomingBills,
  UpcomingBill,
  VisualizationType,
} from './interfaces';

const getUpcomingBills = gql`
  query getUpcomingBills($startDate: date, $endDate: date) {
    payments(where: { date: { _gt: $startDate, _lte: $endDate } }) {
      value
      billId
      bill {
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

const buildPieChartConfig = (bills: UpcomingBill[]): ChartConfig => {
  const categories = getCategoriesFromBillList(bills);
  const billsGroupedByCategory = groupBy(
    bills,
    (bill: UpcomingBill) => bill.bill.category
  ) as BillsGroupedByCategory;
  const totalByCategory = calculateTotalValueByCategory(
    categories,
    billsGroupedByCategory
  );

  const config = {
    labels: categories,
    datasets: [
      {
        data: totalByCategory,
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 1,
      },
    ],
  } as ChartConfig;
  return config;
};

const buildBarChartConfig = (
  bills: UpcomingBill[],
  dateRange: Date[]
): ChartConfig => {
  const totalByMonth = dateRange.map(date =>
    filterBillsList(bills, date).reduce(
      (acc, current) => acc + current.value,
      0
    )
  );
  const monthShortNames = dateRange.map(month => getMonthName(month, 'short'));

  const config = {
    labels: monthShortNames,
    datasets: [
      {
        data: totalByMonth,
        backgroundColor: ['#11884D'],
        borderColor: ['#11884D'],
        borderWidth: 1,
      },
    ],
  } as ChartConfig;
  return config;
};

const buildChartConfig = (
  bills: UpcomingBill[],
  type: VisualizationType,
  dateRange: Date[]
): ChartConfig =>
  type === VisualizationType.BY_CATEGORY
    ? buildPieChartConfig(bills)
    : buildBarChartConfig(bills, dateRange);

const getDatesSixMonthsFromNow = (start: Date, end: Date) =>
  eachMonthOfInterval({
    start,
    end,
  });

const chartConfigSelector = (state: ChartState) => state.chartConfig;
const typeVisualizationSelector = (state: ChartState) =>
  state.typeVisualization;
const filteredBillsSelector = (state: ChartState) => state.filteredBills;
const setChartConfigSelector = (state: ChartState) => state.setChartConfig;
const setBillsSelector = (state: ChartState) => state.setBills;
const setMonthFilterSelector = (state: ChartState) => state.setMonthFilter;
const setTypeVisualizationSelector = (state: ChartState) =>
  state.setTypeVisualization;

const createDateQueryFilters = (future: boolean): Date[] => {
  const currentDate = new Date();
  const start = startOfMonth(addMonths(currentDate, future ? 1 : -6));
  const end = endOfMonth(addMonths(currentDate, future ? 6 : -1));
  return [start, end];
};

const useChartConfig = (future: boolean) => {
  const [startMonthDate, endDateSixMonthsFromNow] =
    createDateQueryFilters(future);
  const dateRangeListFilter = getDatesSixMonthsFromNow(
    startMonthDate,
    endDateSixMonthsFromNow
  );

  const chartConfig = useChartStore(chartConfigSelector);
  const typeVisualization = useChartStore(typeVisualizationSelector);
  const filteredBills = useChartStore(filteredBillsSelector);
  const setChartConfig = useChartStore(setChartConfigSelector);
  const setTypeVisualization = useChartStore(setTypeVisualizationSelector);
  const setMonthFilter = useChartStore(setMonthFilterSelector);
  const setBills = useChartStore(setBillsSelector);

  const { loading, data } = useQuery<ResponseUpcomingBills | undefined>(
    getUpcomingBills,
    {
      variables: {
        startDate: startMonthDate,
        endDate: endDateSixMonthsFromNow,
      },
    }
  );

  useEffect(() => {
    if (data?.payments && data.payments?.length > 0) {
      setBills(data?.payments);
      setMonthFilter(null);
    }
  }, [data, setBills, setMonthFilter]);

  useEffect(() => {
    setChartConfig(
      buildChartConfig(filteredBills, typeVisualization, dateRangeListFilter)
    );
  }, [filteredBills, typeVisualization, setChartConfig]);

  return {
    chartConfig,
    loading,
    data,
    setMonthFilter,
    dateRangeListFilter,
    typeVisualization,
    setTypeVisualization,
  };
};

export default useChartConfig;
