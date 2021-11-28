/* eslint-disable camelcase */
import { BillRepeatType } from '../../../../../interfaces/Bill';

export interface BillMutationResponse {
  data: {
    insert_Bills_one: {
      id: string;
    };
    insert_Users_one: {
      id: string;
    };
  };
}
export interface BillObject {
  userId: string;
  billName: string;
  isRepeatable: boolean;
  repeatType: BillRepeatType;
  dueDate: Date;
  repeatUpTo: Date | null;
  billValue: number;
  repeatForever: boolean;
  observations: string | null;
  eventCalendarId: string | null;
  category: string | undefined;
}

export interface PaymentObject {
  billId: string | undefined;
  dueDate: Date | undefined;
  userId: string | undefined;
  billValue: number | undefined;
  repeatType: string | undefined;
}
