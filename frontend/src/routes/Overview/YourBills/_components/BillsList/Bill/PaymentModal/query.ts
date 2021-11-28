import { gql } from '@apollo/client';

export const MarkBillsAsPaid = gql`
  mutation MarkBillAsPaid($paymentId: uuid!, $setInput: payments_set_input!) {
    update_payments_by_pk(
      pk_columns: { paymentId: $paymentId }
      _set: $setInput
    ) {
      paymentId
    }
  }
`;
