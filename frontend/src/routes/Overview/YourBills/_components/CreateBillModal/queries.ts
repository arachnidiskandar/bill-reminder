import { gql } from '@apollo/client';

export const CREATE_BILL = gql`
  mutation CrateBillMutation($object: Bills_insert_input!, $auth0Id: String!) {
    insert_Users_one(
      object: { auth0Id: $auth0Id }
      on_conflict: { constraint: Users_auth0_id_key, update_columns: [] }
    ) {
      id
    }
    insert_Bills_one(object: $object) {
      id
    }
  }
`;

export const CreatePayments = gql`
  mutation CreatePayments(
    $billId: uuid!
    $dueDate: date!
    $userId: String!
    $repeatType: String!
    $billValue: numeric!
  ) {
    create_payments(
      billId: $billId
      dueDate: $dueDate
      repeatType: $repeatType
      userId: $userId
      billValue: $billValue
    ) {
      __typename
      success
    }
  }
`;
