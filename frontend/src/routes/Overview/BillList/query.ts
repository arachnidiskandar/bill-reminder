import { gql } from '@apollo/client';

export const GET_BILLS = gql`
  query getBills {
    bills {
      id
      billName
      category
      dueDate
      billValue
      repeatType
      observations
      repeatForever
      repeatUpTo
      isRepeatable
      eventCalendarId
    }
  }
`;
