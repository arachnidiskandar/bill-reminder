import cors from 'cors';
import { addYears, endOfToday, lastDayOfMonth, setDate, startOfMonth, startOfToday } from 'date-fns';
import express from 'express';
import { request, GraphQLClient, gql } from 'graphql-request';

import { getDatesBetweenByMonth, GroupBy } from './helpers';

const client = new GraphQLClient('http://host.docker.internal:8080/v1/graphql', {
  headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': 'admin_secret', 'x-hasura-role': 'admin' },
});
const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

interface Bill {
  userId: string;
  value: number;
  dueDate: string;
}

const queryGetBills = gql`
  query MyQuery {
    bills(where: { repeatForever: { _eq: true }, repeatType: { _eq: MONTHLY } }) {
      billValue
      userId
      dueDate
      id
    }
  }
`;

const insertFutureBills = gql`
  mutation MyMutation($objects: [Payments_insert_input!]!) {
    insert_Payments(objects: $objects, on_conflict: { constraint: Payments_pkey }) {
      affected_rows
    }
  }
`;

const calculateNextPayments = async () => {
  try {
    const { bills } = await client.request(queryGetBills);
    const usersBills = bills.flatMap((bill) => {
      const { dueDate } = bill;
      const day = new Date(dueDate).getDate();
      const dueDateStartRange = setDate(endOfToday(), day);
      const listOfDatesByMonth = getDatesBetweenByMonth(dueDateStartRange, addYears(lastDayOfMonth(endOfToday()), 1));
      return listOfDatesByMonth.map((date) => ({
        date,
        value: bill.billValue,
        billId: bill.id,
        userId: bill.userId,
      }));
    });
    const variables = {
      objects: usersBills,
    };
    await client.request(insertFutureBills, variables);
  } catch (error) {
    console.log(error);
  }

  // const test = GroupBy(bills, (bill) => bill.userId);
};

calculateNextPayments();

app.listen(4000);
