import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { BillFormValues, IBill } from '../../../../../../interfaces/Bill';
import useBillsStore, { BillsState } from '../../../billsStore';
import { PaymentBill } from '../../../queries';

const UPDATE_BILL = gql`
  mutation UpdateBill($id: uuid!, $_set: Bills_set_input, $value: numeric) {
    update_Bills_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
    update_payments(where: { billId: { _eq: $id } }, _set: { value: $value }) {
      affected_rows
    }
  }
`;

export interface EditBillObject {
  billName: string;
  billValue: number;
  observations: string | null;
  category: string | undefined;
}

const getUpdatedBillsList = (
  originalBills: PaymentBill[],
  billIdToEdit: string,
  editedBill: EditBillObject
) => {
  return originalBills.map(bi => {
    if (bi.billId !== billIdToEdit) {
      return bi;
    }
    return {
      ...bi,
      bill: {
        ...bi.bill,
        billName: editedBill.billName,
        billValue: editedBill.billValue,
        category: editedBill.category,
        observations: editedBill.observations,
      },
      value: editedBill.billValue,
    };
  });
};

const createBillObject = (formValues: BillFormValues): EditBillObject => {
  const category = formValues?.categoryObject?.value;
  const billObject = {
    ...formValues,
    category,
  };
  delete billObject.categoryObject;
  return billObject;
};

const billSelector = (state: BillsState) => state.bills;
const setBillsSelector = (state: BillsState) => state.setBills;

const useEditBill = () => {
  const [mutate, { error, data, loading }] = useMutation<{
    id: string;
  }>(UPDATE_BILL);
  const toast = useToast();
  const bills = useBillsStore(billSelector);
  const setBills = useBillsStore(setBillsSelector);

  const editBill = async (
    billToEdit: IBill | undefined,
    formValues: BillFormValues,
    closeModalMethod: () => void
  ) => {
    if (!billToEdit) {
      return;
    }
    const bill = createBillObject(formValues);
    try {
      await mutate({
        variables: {
          id: billToEdit.id,
          _set: bill,
          value: bill.billValue,
        },
      });
      toast({
        title: 'Conta editada',
        description: 'Sua conta foi editada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setBills(getUpdatedBillsList(bills, billToEdit.id, bill));
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
