/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

type TextInputProps = {
  register: UseFormRegister<FieldValues>;
  fieldName: string;
  label: string;
  placeHolder: string;
  required?: boolean;
  errorObject: FieldError | undefined;
};
const TextInput = ({
  register,
  fieldName,
  label,
  placeHolder,
  required = false,
  errorObject,
}: TextInputProps) => {
  return (
    <FormControl isRequired={required} mb={3}>
      <FormLabel>{label}</FormLabel>
      <Input
        isInvalid={!!errorObject}
        placeholder={placeHolder}
        {...register(fieldName, { required })}
      />
      <FormErrorMessage>{errorObject?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default TextInput;
