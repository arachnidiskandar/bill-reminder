import { addYears, endOfDay, endOfToday, lastDayOfMonth, setDate } from 'date-fns';
import { Request, Response } from 'express';
import { gql } from 'graphql-request';
import { BillRepeatType } from 'src/@types/interfaces';
import client from 'src/graphql/client';

import { getDatesBetweenByMonth, getDatesBetweenByWeek } from '../../helpers';

interface ICreatePaymentsArgs {
  dueDate: Date;
  billId: string;
  billValue: number;
  userId: string;
  repeatType: BillRepeatType;
  repeatForever: boolean;
  repeatUpTo: string;
}

interface IPaymentsList {
  date: Date;
  value: number;
  billId: string;
  userId: string;
}

const insertFutureBills = gql`
  mutation MyMutation($objects: [payments_insert_input!]!) {
    insert_payments(objects: $objects, on_conflict: { constraint: Payments_pkey }) {
      affected_rows
    }
  }
`;

const createPaymentsList = (args: ICreatePaymentsArgs): IPaymentsList[] => {
  const { dueDate, billId, billValue, userId, repeatType, repeatForever, repeatUpTo } = args;
  const day = new Date(dueDate).getDate();
  const dueDateStartRange = setDate(endOfToday(), day);
  const endDateEndRange = repeatForever ? addYears(lastDayOfMonth(endOfToday()), 1) : endOfDay(new Date(repeatUpTo));
  if (BillRepeatType.MONTHLY === repeatType) {
    const listOfDatesByMonth = getDatesBetweenByMonth(dueDateStartRange, endDateEndRange);
    return listOfDatesByMonth.map((date) => ({
      date,
      value: billValue,
      billId,
      userId,
    }));
  }
  if (BillRepeatType.WEEKLY === repeatType) {
    const listOfDatesByMonth = getDatesBetweenByWeek(dueDateStartRange, endDateEndRange);
    return listOfDatesByMonth.map((date) => ({
      date,
      value: billValue,
      billId,
      userId,
    }));
  }
  return [{ date: dueDate, billId, userId, value: billValue }];
};

const createPaymentsAction = async (req: Request, res: Response) => {
  const params: ICreatePaymentsArgs = req.body.input;

  const variables = {
    objects: createPaymentsList(params),
  };
  console.log(variables);
  // try {
  //   await client.request(insertFutureBills, variables);
  //   return res.json({
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.status(400).json({ message: error.message });
  // }
};

export default createPaymentsAction;
