/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';
import {
  Box,
  FormControl,
  FormLabel,
  useColorMode,
  useColorModeValue,
  useTheme,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  UseControllerReturn,
  UseFormRegister,
} from 'react-hook-form';

type DatePickerProps = {
  label: string;
  required?: boolean;
  fieldName: string;
  errorObject: FieldError | undefined;
  control: any;
};

const DatePicker = ({
  fieldName,
  label,
  errorObject,
  control,
  required = false,
}: DatePickerProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();
  const borderColorOnFocus = useColorModeValue('blue.300', 'blue.500');

  return (
    <FormControl isRequired={required} isInvalid={!!errorObject}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={fieldName}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, value } }) => (
          <Box
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            h="40px"
            w="100%"
            bgColor="transparent"
            border="solid 1px"
            padding="0px 16px"
            borderColor={isFocused ? borderColorOnFocus : 'whiteAlpha.400'}
            borderRadius="md"
            outline="0"
            boxShadow={
              isFocused
                ? `0px 0px 0px 1px ${
                    colorMode === 'dark' ? '#63b3ed ' : '#3182CE'
                  }`
                : 'none'
            }
            transitionProperty="all"
            transitionDuration="200ms"
            as={ReactDatePicker}
            selected={value}
            onChange={(e: any) => onChange(e)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Digite ou selecione uma data"
          />
        )}
      />
      <FormErrorMessage>Campo Obrigatório</FormErrorMessage>
    </FormControl>
  );
};
export default DatePicker;
