/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';
import { BillFormValues } from '../../../../../interfaces/Bill';
import useCalendar from '../../../../../hooks/useCalendar';
import { CreatePayments, CREATE_BILL } from './queries';
import { BillObject, PaymentObject } from './interfaces';

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
  const [loading, setLoading] = useState(false);
  const [mutateBill, { error }] = useMutation<
    any,
    { object: BillObject | null; auth0Id: string | undefined }
  >(CREATE_BILL);
  const [mutatePayments] = useMutation<
    {
      id: string;
    },
    PaymentObject
  >(CreatePayments);
  const toast = useToast();
  const { user } = useAuth0();
  const { createCalendarEventObj, createBillEventOnCalendar } = useCalendar();

  const createBill = async (
    formValues: BillFormValues,
    closeModalMethod: () => void
  ) => {
    setLoading(true);
    const calendarEvent = createCalendarEventObj(formValues);
    const eventCalendarId = await createBillEventOnCalendar(calendarEvent);
    const userId = user?.sub;
    const bill = createBillObject(formValues, userId, eventCalendarId);
    try {
      const response = (await mutateBill({
        variables: {
          object: bill,
          auth0Id: userId,
        },
      })) as any;

      await mutatePayments({
        variables: {
          billId: response.data?.insert_Bills_one.id,
          billValue: bill?.billValue,
          repeatType: bill?.repeatType,
          userId,
          dueDate: bill?.dueDate,
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
    } finally {
      setLoading(false);
    }
  };
  return { error, loading, createBill };
};

export default useCreateBill;
