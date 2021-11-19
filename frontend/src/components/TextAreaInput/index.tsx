/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

type TextAreaInputProps = {
  register: UseFormRegister<FieldValues>;
  fieldName: string;
  label: string;
  placeHolder: string;
  required?: boolean;
  errorObject: FieldError | undefined;
};
const TextAreaInput = ({
  register,
  fieldName,
  label,
  placeHolder,
  required = false,
  errorObject,
}: TextAreaInputProps) => {
  return (
    <FormControl isRequired={required} mb={3}>
      <FormLabel>{label}</FormLabel>
      <Textarea
        isInvalid={!!errorObject}
        placeholder={placeHolder}
        {...register(fieldName, { required })}
      />
      <FormErrorMessage>{errorObject?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default TextAreaInput;
