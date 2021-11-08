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
  Checkbox,
  Spinner,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import RadioGroupInput from '../../../../components/RadioGroup';
import NumberInput from '../../../../components/NumberInput';
import { BillRepeatType } from '../../../../interfaces/Bill';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import useStore, { BillsState } from '../../../../store/useStore';
import Bill from '../Bill';
import useEditBill from './hooks';

export type FormValues = {
  billName: string;
  repeatType: BillRepeatType;
  dueDate: Date;
  billValue: number;
  shouldNotifyUser: boolean;
};

const idBillToEditSelector = (state: BillsState) => state.billToEdit;
const closeModalEditSelector = (state: BillsState) => state.closeModalEdit;
const EditBillModal = () => {
  const billToEdit = useStore(idBillToEditSelector);
  const closeModalEdit = useStore(closeModalEditSelector);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues,
    control,
  } = useForm<FormValues>();
  const { editBill } = useEditBill();

  useEffect(() => {
    if (!billToEdit) {
      return;
    }
    setValue('billName', billToEdit.billName);
    setValue('billValue', billToEdit.billValue);
    setValue('repeatType', billToEdit.repeatType);
    setValue('dueDate', new Date(billToEdit.dueDate));
    setValue('shouldNotifyUser', billToEdit.shouldNotifyUser);
  }, [billToEdit]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) =>
    void editBill(billToEdit, form, closeModalEdit);

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
              <RadioGroupInput
                register={register}
                fieldName="repeatType"
                label="Qual a recorrencia da conta?"
                errorObject={errors.repeatType}
                required
                options={['MONTHLY', 'ANNUALLY', 'ONCE']}
                defaultValue={billToEdit?.repeatType}
              />
              <DatePicker
                fieldName="dueDate"
                label="Data de vencimento"
                required
                errorObject={errors.dueDate}
                control={control}
              />
              <NumberInput
                register={register}
                fieldName="billValue"
                required
                errorObject={errors.billValue}
                label="Valor"
              />
              <Checkbox {...register('shouldNotifyUser')}>
                Enviar Notificações
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeModalEdit} variant="ghost" mr={3}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!isDirty} colorScheme="green">
                Editar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBillModal;
