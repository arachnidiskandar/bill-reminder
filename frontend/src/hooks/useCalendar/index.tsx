/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import ApiCalendar from 'react-google-calendar-api';

interface Recurrence {
  frequency: string;
  interval: string;
  month: number;
  monthDay: number;
  until?: string;
  byDay?: string;
  count?: number;
}

const createRecurrenceString = (recurrance: Recurrence) => {};
interface EventGoogleCalendar {
  summary: string;
  time?: number;
  description?: string;
  start: {
    date: string;
  };
  end: {
    date: string;
  };
  recurrence: string[];
  reminders: {
    useDefault: boolean;
  };
}

const signInGoogle = (): void => ApiCalendar.handleAuthClick();
const signOutGoogle = (): void => ApiCalendar.handleSignutClick();

const createBillEventOnCalendar = async (eventObj: EventGoogleCalendar) => {
  try {
    const createdEvent = await ApiCalendar.createEventFromNow(eventObj);
  } catch (error) {
    console.error(error);
  }
};

const useCalendar = () => {};
