/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Radio,
  RadioGroup as GroupRadio,
} from '@chakra-ui/react';
import React from 'react';
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

type RadioGroupProps = {
  register: UseFormRegister<FieldValues>;
  fieldName: string;
  label: string;
  required?: boolean;
  errorObject: FieldError | undefined;
  options: string[];
  defaultValue?: string;
  templateColumns?: string;
};
const RadioGroupInput = ({
  register,
  fieldName,
  label,
  required = false,
  errorObject,
  options,
  defaultValue,
  templateColumns,
}: RadioGroupProps) => {
  return (
    <FormControl as="fieldset" isRequired={required} mb={2}>
      <FormLabel as="legend">{label}</FormLabel>
      <GroupRadio defaultValue={defaultValue}>
        <Grid templateColumns={templateColumns ?? 'repeat(1, 1fr)'} gap={3}>
          {options.map(option => (
            <Radio
              key={option}
              value={option}
              {...register(fieldName, { required })}
            >
              {option}
            </Radio>
          ))}
        </Grid>
      </GroupRadio>
      <FormErrorMessage>{errorObject?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default RadioGroupInput;
