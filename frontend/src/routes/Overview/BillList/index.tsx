import React, { useEffect, useState } from 'react';
import { Box, Button, Skeleton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { useQuery } from '@apollo/client';
import CreateBillModal from './CreateBillModal';
import DeleteBillModal from './DeleteBillModal';
import { GET_BILLS } from './query';
import { IBill } from '../../../interfaces/Bill';
import Bill from './Bill';
import useStore, { BillsState } from '../../../store/useStore';
import EditBillModal from './EditBillModal';

interface BillsList {
  bills: IBill[];
}

const selector = (state: BillsState) => state.bills;
const setBillsSelector = (state: BillsState) => state.setBills;

const BillList = () => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const { loading, data } = useQuery<BillsList>(GET_BILLS);
  const bills = useStore(selector);
  const setBills = useStore(setBillsSelector);

  useEffect(() => {
    if (!data) {
      return;
    }
    setBills(data.bills);
  }, [data]);

  if (loading) {
    return (
      <>
        <Skeleton h={84} my={2} />
        <Skeleton h={84} my={2} />
        <Skeleton h={84} my={2} />
      </>
    );
  }

  return (
    <>
      <Box w="100%" py={4} color="white">
        {bills &&
          bills.map(bill => (
            <Bill
              key={bill.id}
              dueDate={bill.dueDate}
              billName={bill.billName}
              billValue={bill.billValue}
              id={bill.id}
            />
          ))}
        <Button
          leftIcon={<AddIcon />}
          size="lg"
          w="100%"
          mt={4}
          onClick={() => setIsModalCreateOpen(true)}
        >
          Adicionar nova conta
        </Button>
      </Box>
      <DeleteBillModal />
      <EditBillModal />
      <CreateBillModal
        isOpen={isModalCreateOpen}
        toggleMethod={() => setIsModalCreateOpen(false)}
      />
    </>
  );
};

export default BillList;
