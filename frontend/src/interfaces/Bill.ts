export enum BillRepeatType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  WEEKLY = 'WEEKLY',
}

export interface IBill {
  id: string;
  billName: string;
  isRepeatable: boolean;
  repeatType: BillRepeatType;
  category: string | undefined;
  dueDate: string;
  repeatUpTo: string;
  billValue: number;
  repeatForever: boolean;
  observations?: string | null;
  eventCalendarId?: string;
}

export type BillFormValues = {
  billName: string;
  isRepeatable: boolean;
  repeatType: BillRepeatType;
  categoryObject?: { value: string; label: string };
  dueDate: Date;
  repeatUpTo: Date | null;
  billValue: number;
  repeatForever: boolean;
  observations: string | null;
};

export interface BillsList {
  bills: IBill[];
}
