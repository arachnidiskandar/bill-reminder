import { gql, useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import React from 'react';
import ModalAlert from '../../../../../../components/ModalAlert';
import useBillsStore, { BillsState } from '../../../billsStore';

const idBillDeleteSelector = (state: BillsState) => state.idToDelete;
const closeDeleteModalSelector = (state: BillsState) => state.closeModalDelete;
const deleteBillSelector = (state: BillsState) => state.deleteBill;

const DELETE_BILL = gql`
  mutation DeleteBillById($id: uuid!) {
    delete_Bills_by_pk(id: $id) {
      id
    }
  }
`;

const DeleteBillModal = () => {
  const idBillToDelete = useBillsStore(idBillDeleteSelector);
  const closeModalDelete = useBillsStore(closeDeleteModalSelector);
  const onDeleteBill = useBillsStore(deleteBillSelector);
  const toast = useToast();
  const [mutate] = useMutation<{ id: string }>(DELETE_BILL);

  const onConfirmDelete = async () => {
    try {
      await mutate({ variables: { id: idBillToDelete } });
      onDeleteBill(idBillToDelete);
      toast({
        title: 'Conta deletada',
        description: 'Sua conta foi deletada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Ocorreu um erro.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <ModalAlert
      isOpen={!!idBillToDelete}
      title="Excluir conta"
      onClose={closeModalDelete}
      onConfirm={onConfirmDelete}
    />
  );
};

export default DeleteBillModal;
