import { gql } from '@apollo/client';

export const GET_BILLS = gql`
  query getBills {
    bills {
      id
      billName
      dueDate
      billValue
      repeatType
      shouldNotifyUser
    }
  }
`;
