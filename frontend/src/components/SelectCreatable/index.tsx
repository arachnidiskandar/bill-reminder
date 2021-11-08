/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import {
  Controller,
  FieldError,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';
import Creatable from 'react-select/creatable';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useColorMode,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';

type selectOption = {
  value: string;
};
type SelectCreatableProps = {
  fieldName: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: selectOption[];
  control: any;
  errorObject: FieldError | undefined;
};

const SelectCreatable = ({
  fieldName,
  label,
  placeholder,
  required = false,
  options,
  control,
  errorObject,
}: SelectCreatableProps) => {
  return (
    <FormControl isRequired={required} isInvalid={!!errorObject}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={fieldName}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Creatable
            {...field}
            isClearable
            placeholder={placeholder}
            options={options}
          />
        )}
      />
      {errorObject && <FormErrorMessage>Campo obrigatório</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectCreatable;
