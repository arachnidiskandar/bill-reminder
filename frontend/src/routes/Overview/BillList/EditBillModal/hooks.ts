import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';
import React from 'react';
import { FormValues } from '.';
import useNotification from '../../../../hooks/useNotification';
import { IBill } from '../../../../interfaces/Bill';
import useStore, { BillsState } from '../../../../store/useStore';

const UPDATE_BILL = gql`
  mutation MyMutation($id: uuid!, $_set: Bills_set_input) {
    update_Bills_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
  }
`;

const buildBillObj = async (
  formValues: FormValues,
  createSubscription: () => Promise<PushSubscription | undefined>,
  shouldCreateNewSub: boolean
) => {
  if (!formValues.shouldNotifyUser) {
    return { ...formValues, notificationSubscription: null };
  }
  if (!shouldCreateNewSub) {
    return { ...formValues };
  }
  const subscription = await createSubscription();
  return {
    ...formValues,
    notificationSubscription: JSON.stringify(subscription),
  };
};

const getUpdatedBillsArray = (
  id: string,
  bills: IBill[],
  formValues: FormValues
) => {
  const indexBillToEdit = bills.findIndex(bill => bill.id === id);
  const updatedBillsList = [
    ...bills.slice(0, indexBillToEdit),
    { id, ...formValues },
    ...bills.slice(indexBillToEdit + 1, bills.length - 1),
  ];
  return updatedBillsList;
};

const billSelector = (state: BillsState) => state.bills;
const setBillsSelector = (state: BillsState) => state.setBills;

const useEditBill = () => {
  const [mutate, { error, data, loading }] = useMutation<{
    id: IBill;
  }>(UPDATE_BILL);
  const toast = useToast();
  const bills = useStore(billSelector);
  const setBills = useStore(setBillsSelector);
  const { subscribeToNotification } = useNotification();

  const editBill = async (
    billToEdit: IBill | null,
    formValues: FormValues,
    closeModalMethod: () => void
  ) => {
    if (!billToEdit) {
      return;
    }
    const bill = await buildBillObj(
      formValues,
      subscribeToNotification,
      !billToEdit.shouldNotifyUser
    );
    const updatedBills = getUpdatedBillsArray(billToEdit.id, bills, bill);
    try {
      await mutate({
        variables: {
          id: billToEdit.id,
          _set: bill,
        },
      });
      setBills(updatedBills);
      toast({
        title: 'Conta editada',
        description: 'Sua conta foi editada com sucesso.',
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
  return { error, data, loading, editBill };
};

export default useEditBill;
