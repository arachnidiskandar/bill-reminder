import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';
import { FormValues } from '.';
import useNotification from '../../../../hooks/useNotification';
import { IBill } from '../../../../interfaces/Bill';

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

const buildBillObj = async (
  formValues: FormValues,
  userId: string | undefined
) => {
  return {
    ...formValues,
    userId,
  };
};

const useCreateBill = () => {
  const [mutate, { error, data, loading }] = useMutation<{
    savedBill: IBill;
  }>(CREATE_BILL);
  const toast = useToast();
  const { user } = useAuth0();

  const createBill = async (
    formValues: FormValues,
    closeModalMethod: () => void
  ) => {
    console.log(formValues);
    // const bill = await buildBillObj(formValues, user?.sub);

    // try {
    //   await mutate({
    //     variables: {
    //       object: bill,
    //       auth0Id: user?.sub,
    //     },
    //   });
    //   toast({
    //     title: 'Conta criada',
    //     description: 'Sua conta foi criada com sucesso.',
    //     status: 'success',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   closeModalMethod();
    // } catch (e: any) {
    //   toast({
    //     title: 'Error',
    //     description: 'Ocorreu um erro.',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   console.error(e);
    // }
  };
  return { error, data, loading, createBill };
};

export default useCreateBill;
