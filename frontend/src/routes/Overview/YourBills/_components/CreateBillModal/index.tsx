import React from 'react';
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
import RadioGroupInput from '../../../../../components/RadioGroup';
import NumberInput from '../../../../../components/NumberInput';
import { BillFormValues } from '../../../../../interfaces/Bill';
import useCreateBill from './hooks';
import TextInput from '../../../../../components/TextInput';
import DatePicker from '../../../../../components/DatePicker';
import SelectCreatable from '../../../../../components/SelectCreatable';
import TextAreaInput from '../../../../../components/TextAreaInput';

type CreateModalProps = {
  isOpen: boolean;
  toggleMethod: () => void;
};

export const options = [
  { value: 'food', label: 'Comida' },
  { value: 'credit card', label: 'Cartão de crédito' },
  { value: 'gift', label: 'Presente' },
  { value: 'pets', label: 'Pets' },
  { value: 'taxes', label: 'Imposto' },
  { value: 'vacation', label: 'Férias' },
  { value: 'shopping', label: 'Compras' },
  { value: 'utilities', label: 'Utilidades' },
  { value: 'vehicle ', label: 'Veículo' },
];

const CreateBillModal = ({ isOpen, toggleMethod }: CreateModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<BillFormValues>();
  const { loading, createBill } = useCreateBill();

  const onSubmit: SubmitHandler<BillFormValues> = async (
    form: BillFormValues
  ) => void createBill(form, toggleMethod);

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
  return (
    <>
      <Modal isOpen={isOpen} onClose={toggleMethod}>
        <ModalOverlay />
        <ModalContent ml={3} mr={3}>
          <ModalHeader>Criar Conta</ModalHeader>
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
              <Button onClick={toggleMethod} variant="ghost" mr={3}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="green" disabled={loading}>
                {loading ? <Spinner /> : 'Criar Conta'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBillModal;
