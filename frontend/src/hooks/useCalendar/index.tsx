/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import ApiCalendar from 'react-google-calendar-api';
import { BillFormValues, BillRepeatType } from '../../interfaces/Bill';

export interface Recurrence {
  frequency: string;
  month?: number;
  monthDay?: number;
  until?: string;
  byDay?: string | undefined;
  count?: number;
}

interface EventGoogleCalendar {
  summary: string;
  time?: number;
  description?: string | null;
  start: {
    date: string;
  };
  end: {
    date: string;
  };
  recurrence?: string[];
  reminders?: {
    useDefault: boolean;
  };
}

// interface BillCreateResponse {
//   body: string;
//   headers: any;
//   result: {
//     description: string;
//     icalUID: string;
//     id: string;
//     summary: string;
//   };
//   status: number;
//   statusText: string | null;
// }

const buildRecurrenceObj = (
  dueDate: Date,
  repeatType: BillRepeatType,
  repeatUpTo: Date,
  repeatForever: boolean
): Recurrence => {
  const day = dueDate && dueDate.getDate();
  const month = dueDate && dueDate.getMonth() + 1;
  const repeatUpToFullYear = repeatUpTo && repeatUpTo.getFullYear();
  const weekDaysNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const until = `${repeatUpToFullYear}${month}${day}T000000Z`;

  const recurrenceYearlyBaseObj: Recurrence = {
    frequency: repeatType,
    month,
    monthDay: day,
  };
  const recurrenceMonthlyBaseObj: Recurrence = {
    frequency: repeatType,
    monthDay: day,
  };
  const recurrenceWeeklyBaseObj: Recurrence = {
    frequency: repeatType,
    byDay: weekDaysNames[dueDate.getDay()],
  };

  const conditionalObj = {
    YEARLY: recurrenceYearlyBaseObj,
    MONTHLY: recurrenceMonthlyBaseObj,
    WEEKLY: recurrenceWeeklyBaseObj,
  };

  if (repeatForever) {
    return conditionalObj[repeatType];
  }
  return { ...conditionalObj[repeatType], until };
};

const createRecurrenceString = (recurrence: Recurrence): string => {
  const { frequency, month, monthDay, byDay, until } = recurrence;

  const rulesOptions: any = {
    YEARLY: `RRULE:FREQ=${frequency};INTERVAL=1;BYMONTH=${
      month ?? ''
    };BYMONTHDAY=${monthDay ?? ''}`,
    MONTHLY: `RRULE:FREQ=${frequency};INTERVAL=1;BYMONTHDAY=${monthDay ?? ''}`,
    WEEKLY: `RRULE:FREQ=${frequency};INTERVAL=1;BYDAY=${byDay ?? ''}`,
  };

  if (!until) {
    return rulesOptions[frequency];
  }
  return { ...rulesOptions[frequency], until };
};

const createCalendarEventObj = (
  formValues: BillFormValues
): EventGoogleCalendar => {
  const {
    isRepeatable,
    billName,
    dueDate,
    repeatType,
    repeatUpTo,
    repeatForever,
    observations,
  } = formValues;

  const eventObj = {
    summary: billName,
    start: {
      date: dueDate.toLocaleDateString('en-CA', {
        timeZone: 'America/Sao_Paulo',
      }),
    },
    end: {
      date: dueDate.toLocaleDateString('en-CA', {
        timeZone: 'America/Sao_Paulo',
      }),
    },
    description: observations,
  };

  if (!isRepeatable) {
    return eventObj;
  }

  const recurrenceObj = buildRecurrenceObj(
    dueDate,
    repeatType,
    repeatUpTo,
    repeatForever
  );

  const RruleString = createRecurrenceString(recurrenceObj);

  return { ...eventObj, recurrence: [RruleString] };
};

const signInGoogle = (): void => ApiCalendar.handleAuthClick();
const signOutGoogle = (): void => ApiCalendar.handleSignoutClick();

const createBillEventOnCalendar = async (
  eventObj: EventGoogleCalendar
): Promise<string | null> => {
  try {
    const { result } = await ApiCalendar.createEvent(eventObj);
    return result.id;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const updateBillEventOnCalendar = async (
  eventObj: EventGoogleCalendar,
  eventId: string
): Promise<string | null> => {
  try {
    const { result } = await ApiCalendar.updateEvent(eventObj, eventId);
    console.log(result);
    return result.id;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const useCalendar = () => {
  return {
    signInGoogle,
    signOutGoogle,
    createCalendarEventObj,
    createBillEventOnCalendar,
    updateBillEventOnCalendar,
  };
};

export default useCalendar;
