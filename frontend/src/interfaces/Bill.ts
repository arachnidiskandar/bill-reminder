export enum BillRepeatType {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  WEEKLY = 'WEEKLY',
}

export interface IBill {
  id: string;
  billName: string;
  billValue: number;
  dueDate: Date;
  repeatType: BillRepeatType;
  shouldNotifyUser: boolean;
}
