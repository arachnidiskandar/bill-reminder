import {
  addMonths,
  eachMonthOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChartState, UpcomingBill, VisualizationType } from './interfaces';

const getDateToFilter = (index: number | null): Date | null => {
  const currentDate = new Date();
  const start = addMonths(startOfMonth(currentDate), 1);
  const end = addMonths(startOfMonth(currentDate), 7);
  return index
    ? eachMonthOfInterval({
        start,
        end,
      })[index]
    : null;
};

export const filterBillsList = (
  bills: UpcomingBill[],
  dateToFilter: Date | null
): UpcomingBill[] => {
  if (!dateToFilter) {
    return bills;
  }
  return bills.filter(bill => {
    const billDate = new Date(bill.date);
    return (
      isAfter(billDate, startOfDay(dateToFilter)) &&
      isBefore(billDate, endOfMonth(dateToFilter))
    );
  });
};

const useChartStore = create<ChartState>(
  devtools(set => ({
    bills: [],
    chartConfig: null,
    typeVisualization: VisualizationType.BY_MONTHS,
    filteredBills: [],
    monthFilter: 0,
    setChartConfig: chartConfig => set({ chartConfig }),
    setFilteredBills: filteredBills => set({ filteredBills }),
    setMonthFilter: monthFilter =>
      set(prevState => ({
        filteredBills: filterBillsList(
          prevState.bills,
          getDateToFilter(monthFilter)
        ),
        monthFilter,
      })),
    setTypeVisualization: typeVisualization =>
      set(prevState => ({
        typeVisualization,
        filteredBills:
          typeVisualization === 'byMonths'
            ? prevState.bills
            : prevState.filteredBills,
      })),
    setBills: bills => set({ bills }),
  }))
);

export default useChartStore;
