import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';
import {
  BillFormValues,
  BillRepeatType,
  IBill,
} from '../../../../../interfaces/Bill';
import useCalendar from '../../../../../hooks/useCalendar';

const CREATE_BILL = gql`
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
export interface BillObject {
  userId: string;
  billName: string;
  isRepeatable: boolean;
  repeatType: BillRepeatType;
  dueDate: Date;
  repeatUpTo: Date | null;
  billValue: number;
  repeatForever: boolean;
  observations: string | null;
  eventCalendarId: string | null;
  category: string | undefined;
}

const createBillObject = (
  formValues: BillFormValues,
  userId: string | undefined,
  eventCalendarId: string | null
): BillObject | null => {
  if (!userId) {
    return null;
  }
  const category = formValues?.categoryObject?.value;
  const billObject = {
    ...formValues,
    userId,
    eventCalendarId,
    category,
  };
  delete billObject.categoryObject;
  return billObject;
};

const useCreateBill = () => {
  const [mutate, { error, data, loading }] = useMutation<{
    savedBill: IBill;
  }>(CREATE_BILL);
  const toast = useToast();
  const { user } = useAuth0();
  const { createCalendarEventObj, createBillEventOnCalendar } = useCalendar();

  const createBill = async (
    formValues: BillFormValues,
    closeModalMethod: () => void
  ) => {
    const calendarEvent = createCalendarEventObj(formValues);
    const eventCalendarId = await createBillEventOnCalendar(calendarEvent);
    const userId = user?.sub;
    const bill = createBillObject(formValues, userId, eventCalendarId);
    try {
      await mutate({
        variables: {
          object: bill,
        },
      });
      toast({
        title: 'Conta criada',
        description: 'Sua conta foi criada com sucesso.',
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
  return { error, data, loading, createBill };
};

export default useCreateBill;
