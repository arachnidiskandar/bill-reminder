import { TypedDocumentNode, useQuery } from '@apollo/client';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useBillsStore, { BillsState } from '../../billsStore';
import { GetBillsResponse } from '../../queries';
import BillsList from '../BillsList';
import CreateBillModal from '../CreateBillModal';
import SkeletonBills from '../SkeletonBills';

interface BillTabProps {
  query: TypedDocumentNode<GetBillsResponse>;
  queryVariables?: {
    startDate?: Date;
    endDate?: Date;
  };
  disablePayment?: boolean;
}
const billsSelector = (state: BillsState) => state.bills;
const setBillsSelector = (state: BillsState) => state.setBills;
const disablePaymentSelector = (state: BillsState) => state.disablePayment;

const BillTab = ({ query, queryVariables, disablePayment }: BillTabProps) => {
  const bills = useBillsStore(billsSelector);
  const setBills = useBillsStore(setBillsSelector);
  const disablePaymentFunction = useBillsStore(disablePaymentSelector);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const { loading, data } = useQuery<GetBillsResponse>(query, {
    variables: queryVariables,
  });

  useEffect(() => {
    if (data) {
      setBills(data?.payments);
    }
  }, [data, setBills]);

  useEffect(() => {
    if (disablePayment) {
      disablePaymentFunction();
    }
  }, [disablePayment, disablePaymentFunction]);

  if (loading) {
    return <SkeletonBills />;
  }

  return (
    <Box>
      <BillsList bills={bills} />
      <Button
        leftIcon={<AddIcon />}
        colorScheme="green"
        size="lg"
        w="100%"
        mt={4}
        onClick={() => setIsModalCreateOpen(true)}
      >
        <Text>Adicionar nova conta</Text>
      </Button>
      <CreateBillModal
        isOpen={isModalCreateOpen}
        toggleMethod={() => setIsModalCreateOpen(false)}
      />
    </Box>
  );
};

export default BillTab;
