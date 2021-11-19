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
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import RadioGroupInput from '../../../../components/RadioGroup';
import NumberInput from '../../../../components/NumberInput';
import { BillFormValues } from '../../../../interfaces/Bill';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import useStore, { BillsState } from '../../../../store/useStore';
import useEditBill from './hooks';
import SelectCreatable from '../../../../components/SelectCreatable';
import { options } from '../CreateBillModal';
import TextAreaInput from '../../../../components/TextAreaInput';

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
  } = useForm<BillFormValues>();
  const { editBill, loading } = useEditBill();

  const isRepeatableFieldValue = useWatch({
    control,
    name: 'isRepeatable',
    defaultValue: false,
  });
  const isRepeatableForeverFieldValue = useWatch({
    control,
    name: 'repeatForever',
    defaultValue: false,
  });

  useEffect(() => {
    if (!billToEdit) {
      return;
    }
    setValue('billName', billToEdit.billName);
    setValue('billValue', billToEdit.billValue);
    setValue('repeatType', billToEdit.repeatType);
    setValue('dueDate', new Date(billToEdit.dueDate));
    setValue('categoryObject.value', billToEdit.category ?? '');
    setValue('categoryObject.label', billToEdit.category ?? '');
    setValue('repeatUpTo', billToEdit.repeatUpTo);
    setValue('isRepeatable', billToEdit.isRepeatable);
    setValue('repeatForever', billToEdit.repeatForever);
    setValue('observations', billToEdit.observations ?? null);
  }, [billToEdit]);

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

              <DatePicker
                fieldName="dueDate"
                label="Data de vencimento"
                required
                errorObject={errors.dueDate}
                control={control}
              />
              <Checkbox my={2} {...register('isRepeatable')}>
                Repetível
              </Checkbox>
              {isRepeatableFieldValue && (
                <>
                  <RadioGroupInput
                    register={register}
                    fieldName="repeatType"
                    label="Qual a recorrencia da conta?"
                    errorObject={errors.repeatType}
                    required
                    options={['WEEKLY', 'MONTHLY', 'ANNUALLY']}
                    defaultValue={getValues('repeatType')}
                  />
                  <DatePicker
                    fieldName="repeatUpTo"
                    label="Repete até o dia"
                    required={!isRepeatableForeverFieldValue}
                    errorObject={errors.repeatUpTo}
                    control={control}
                    disabled={isRepeatableForeverFieldValue}
                  />
                  <Checkbox my={2} {...register('repeatForever')}>
                    Sem prazo final
                  </Checkbox>
                </>
              )}
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
              <Button type="submit" colorScheme="green" disabled={loading}>
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
