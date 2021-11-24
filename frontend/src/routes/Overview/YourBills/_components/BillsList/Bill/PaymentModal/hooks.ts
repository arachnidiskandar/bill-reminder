import { useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import useBillsStore, { BillsState } from '../../../../billsStore';
import { MarkBillsAsPaid } from './query';

interface SetInput {
  isPaid: boolean;
  value?: number;
}

const createQueryVariables = (
  paymentId: string,
  billValue: number | undefined
) => {
  return billValue
    ? { paymentId, setInput: { isPaid: true, value: billValue } }
    : { paymentId, setInput: { isPaid: true } };
};

const deleteBillSelector = (state: BillsState) => state.deleteBill;

const usePayBill = () => {
  const [mutate, { error, data, loading }] = useMutation<
    {
      id: string;
    },
    { paymentId: string; setInput: SetInput }
  >(MarkBillsAsPaid);
  const toast = useToast();
  const deleteBill = useBillsStore(deleteBillSelector);

  const payBill = async (
    paymentId: string,
    closeModalMethod: () => void,
    billValue?: number
  ) => {
    const queryVariables = createQueryVariables(paymentId, billValue);
    deleteBill(paymentId);
    try {
      await mutate({
        variables: queryVariables,
      });

      toast({
        title: 'Conta Paga',
        description: 'Sua conta foi marcada como paga.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      closeModalMethod();
    } catch (e: any) {
      toast({
        title: 'Error',
        description: 'Ocorreu um erro.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(e);
    }
  };
  return { payBill, error, data, loading };
};

export default usePayBill;
