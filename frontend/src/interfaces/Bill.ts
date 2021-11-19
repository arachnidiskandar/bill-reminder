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
  dueDate: Date;
  repeatUpTo: Date;
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
  repeatUpTo: Date;
  billValue: number;
  repeatForever: boolean;
  observations: string | null;
};
