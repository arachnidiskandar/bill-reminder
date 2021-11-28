import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import NumberInput from '../../../../../../components/NumberInput';
import { BillFormValues } from '../../../../../../interfaces/Bill';
import TextInput from '../../../../../../components/TextInput';
import useEditBill from './hooks';
import SelectCreatable from '../../../../../../components/SelectCreatable';
import { options } from '../../CreateBillModal';
import TextAreaInput from '../../../../../../components/TextAreaInput';
import useBillsStore, { BillsState } from '../../../billsStore';

const idBillToEditSelector = (state: BillsState) => state.paymentBillToEdit;
const closeModalEditSelector = (state: BillsState) => state.closeModalEdit;

const EditBillModal = () => {
  const billToEdit = useBillsStore(idBillToEditSelector);
  const closeModalEdit = useBillsStore(closeModalEditSelector);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    control,
  } = useForm<BillFormValues>();
  const { editBill, loading } = useEditBill();

  useEffect(() => {
    if (!billToEdit) {
      return;
    }
    setValue('billName', billToEdit.billName);
    setValue('billValue', billToEdit.billValue);
    setValue('categoryObject.value', billToEdit.category ?? '');
    setValue('categoryObject.label', billToEdit.category ?? '');
    setValue('observations', billToEdit.observations ?? null);
  }, [billToEdit, setValue]);

  const onSubmit: SubmitHandler<BillFormValues> = async (
    form: BillFormValues
  ) => void editBill(billToEdit, form, closeModalEdit);

  return (
    <>
      <Modal isOpen={!!billToEdit} onClose={closeModalEdit}>
        <ModalOverlay />
        <ModalContent ml={3} mr={3}>
          <ModalHeader>Editar Conta</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <TextInput
                register={register}
                fieldName="billName"
                label="Nome da conta"
                placeHolder="Nome da conta"
                errorObject={errors.billName}
                required
              />
              <NumberInput
                register={register}
                fieldName="billValue"
                required
                errorObject={errors.billValue}
                label="Valor"
              />
              <SelectCreatable
                fieldName="categoryObject"
                label="Selecione uma categoria"
                placeholder="Selecione ou crie uma categoria..."
                required
                control={control}
                options={options}
                errorObject={errors.categoryObject?.value}
              />

              <TextAreaInput
                register={register}
                fieldName="observations"
                label="Observações"
                placeHolder="Insira links, notas, explicações, etc..."
                errorObject={errors.observations}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModalEdit} variant="ghost" mr={3}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                disabled={!isDirty || loading}
              >
                {loading ? <Spinner /> : 'Editar Conta'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBillModal;
