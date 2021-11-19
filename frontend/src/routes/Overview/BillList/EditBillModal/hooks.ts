import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';

import useNotification from '../../../../hooks/useNotification';
import {
  BillFormValues,
  BillRepeatType,
  IBill,
} from '../../../../interfaces/Bill';
import useStore, { BillsState } from '../../../../store/useStore';
import useCalendar from '../../../../hooks/useCalendar';
import { BillObject } from '../CreateBillModal/hooks';

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
  repeatUpTo: Date;
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
    id: IBill;
  }>(UPDATE_BILL);
  const toast = useToast();
  const bills = useStore(billSelector);
  const setBills = useStore(setBillsSelector);
  const { createCalendarEventObj, updateBillEventOnCalendar } = useCalendar();

  const editBill = async (
    billToEdit: IBill | null,
    formValues: BillFormValues,
    closeModalMethod: () => void
  ) => {
    if (!billToEdit) {
      return;
    }
    const eventId = billToEdit.eventCalendarId ?? ('' as string);
    const calendarEvent = createCalendarEventObj(formValues);
    const eventCalendarId = await updateBillEventOnCalendar(
      calendarEvent,
      eventId
    );
    const bill = createBillObject(formValues);
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
