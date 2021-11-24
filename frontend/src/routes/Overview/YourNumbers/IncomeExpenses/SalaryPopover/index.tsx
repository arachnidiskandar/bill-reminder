import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Grid,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSalary } from './hooks';

const SalaryPopover = ({
  setSalaryCb,
}: {
  setSalaryCb: (salary: number | undefined) => void;
}) => {
  const [salary, setSalary] = useState<number | undefined>();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { loading, updateUserSalary } = useSalary(setSalaryCb);
  const initialFocusRef = React.useRef<any>();

  const handleSalaryValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;
    setSalary(value);
  };

  const handleSalaryUpdate = () => updateUserSalary(salary);

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      placement="bottom-end"
      closeOnBlur={false}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button mt={2} size="sm" leftIcon={<AddIcon />} colorScheme="green">
          Cadastrar salário
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Box mt={4}>
            <FormLabel>Digite o valor do seu salário</FormLabel>
            <NumberInput
              ref={initialFocusRef}
              defaultValue={salary}
              precision={2}
            >
              <NumberInputField onChange={handleSalaryValueChange} />
            </NumberInput>
          </Box>
        </PopoverBody>
        <PopoverFooter border="0" d="flex" justifyContent="end" pb={4}>
          <ButtonGroup size="sm">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              disabled={loading}
              onClick={handleSalaryUpdate}
              type="submit"
            >
              {loading ? <Spinner /> : 'Salvar'}
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default SalaryPopover;
