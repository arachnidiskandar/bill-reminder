import React from 'react';
import { Box } from '@chakra-ui/react';
import Bill from './Bill';
import DeleteBillModal from './DeleteBillModal';
import EditBillModal from './EditBillModal';
import { BillsList } from '../../../../../interfaces/Bill';
import { PaymentBill } from '../../queries';

const BillsList = ({ bills }: { bills: PaymentBill[] | undefined }) => {
  if (!bills) {
    return null;
  }
  return (
    bills && (
      <>
        <Box w="100%">
          {bills.map(bill => (
            <Bill
              key={bill.paymentId}
              dueDate={bill.date}
              billName={bill.bill.billName}
              billValue={bill.value}
              paymentId={bill.paymentId}
            />
          ))}
        </Box>
        <DeleteBillModal />
        <EditBillModal />
      </>
    )
  );
};

export default BillsList;
