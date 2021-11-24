import { gql } from '@apollo/client';

import { IBill } from '../../../interfaces/Bill';

export interface PaymentBill {
  paymentId: string;
  value: number;
  bill: IBill;
  billId: string;
  date: string;
}

export interface GetBillsResponse {
  payments: PaymentBill[];
}

export const getNextBills = gql`
  query getBills($startDate: date, $endDate: date) {
    payments(
      where: {
        isPaid: { _eq: false }
        date: { _gte: $startDate, _lte: $endDate }
      }
      order_by: { date: asc }
    ) {
      paymentId
      value
      bill {
        id
        billValue
        dueDate
        billName
        category
        repeatType
        repeatUpTo
        observations
        isRepeatable
        repeatForever
        eventCalendarId
      }
      billId
      date
    }
  }
`;

export const getDelayedBills = gql`
  query getDelayedBills {
    payments(
      where: { isDelayed: { _eq: true }, isPaid: { _eq: false } }
      order_by: { date: asc }
    ) {
      paymentId
      value
      bill {
        id
        billValue
        dueDate
        billName
        category
        repeatType
        repeatUpTo
        observations
        isRepeatable
        repeatForever
        eventCalendarId
      }
      billId
      date
    }
  }
`;

export const getPaidBills = gql`
  query getDelayedBills {
    payments(where: { isPaid: { _eq: true } }, order_by: { date: asc }) {
      paymentId
      value
      bill {
        id
        billValue
        dueDate
        billName
        category
        repeatType
        repeatUpTo
        observations
        isRepeatable
        repeatForever
        eventCalendarId
      }
      billId
      date
    }
  }
`;
