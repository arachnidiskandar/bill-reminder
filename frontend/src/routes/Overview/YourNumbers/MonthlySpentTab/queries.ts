import { gql } from '@apollo/client';

export const getBillsThisMonth = gql`
  query GetBillsThisMonth($startDate: date, $endDate: date) {
    payments(where: { date: { _gte: $startDate, _lte: $endDate } }) {
      bill {
        category
        billName
      }
      value
    }
    paymentsAggregate(where: { date: { _gte: $startDate, _lte: $endDate } }) {
      aggregate {
        sum {
          value
        }
      }
    }
  }
`;
