import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import {
  BillFormValues,
  BillRepeatType,
  IBill,
} from '../../../../../../interfaces/Bill';
import useCalendar from '../../../../../../hooks/useCalendar';
import useBillsStore, { BillsState } from '../../../billsStore';
import { PaymentBill } from '../../../queries';

const UPDATE_BILL = gql`
  mutation MyMutation($id: uuid!, $_set: Bills_set_input) {
    update_Bills_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
  }
`;

export interface EditBillObject {
  billName: string;
  isRepeatable: boolean;
  repeatType: BillRepeatType;
  dueDate: Date;
  repeatUpTo: Date | null;
  billValue: number;
  repeatForever: boolean;
  observations: string | null;
  category: string | undefined;
}

const getUpdatedBillsArray = (
  id: string,
  bills: IBill[],
  formValues: EditBillObject
) => {
  const indexBillToEdit = bills.findIndex(bill => bill.id === id);
  const updatedBillsList = [
    ...bills.slice(0, indexBillToEdit),
    { id, ...formValues },
    ...bills.slice(indexBillToEdit + 1, bills.length - 1),
  ];
  return updatedBillsList;
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
  const { createCalendarEventObj, updateBillEventOnCalendar } = useCalendar();

  const editBill = async (
    billToEdit: IBill | undefined,
    formValues: BillFormValues,
    closeModalMethod: () => void
  ) => {
    if (!billToEdit) {
      return;
    }
    const eventId = billToEdit.eventCalendarId ?? ('' as string);
    const calendarEvent = createCalendarEventObj(formValues);
    // const eventCalendarId = await updateBillEventOnCalendar(
    //   calendarEvent,
    //   eventId
    // );
    const bill = createBillObject(formValues);
    // const updatedBills = getUpdatedBillsArray(billToEdit.id, bills, bill);
    console.log(bill);
    try {
      await mutate({
        variables: {
          id: billToEdit.id,
          _set: bill,
        },
      });
      // setBills(updatedBills);
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
