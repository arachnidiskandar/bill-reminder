import { addMonths, differenceInMonths } from 'date-fns';

const getDatesBetweenByMonth = (startDate: Date, endDate: Date): Date[] => {
  const months = differenceInMonths(endDate, startDate);

  return [...Array(months + 1).keys()].map((i) => addMonths(startDate, i));
};

export default getDatesBetweenByMonth;
