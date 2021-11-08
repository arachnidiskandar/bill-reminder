import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput as InputNumber,
  NumberInputField,
} from '@chakra-ui/react';
import React from 'react';
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

type NumberInputProps = {
  register: UseFormRegister<FieldValues>;
  fieldName: string;
  label: string;
  required?: boolean;
  errorObject: FieldError | undefined;
};
const NumberInput = ({
  register,
  fieldName,
  label,
  required = false,
  errorObject,
}: NumberInputProps) => {
  return (
    <FormControl isRequired={required} mb={3}>
      <FormLabel>{label}</FormLabel>
      <InputNumber>
        <NumberInputField {...register(fieldName, { required })} />
      </InputNumber>
      <FormErrorMessage>{errorObject?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default NumberInput;
