import {
  Box,
  Button,
  ButtonGroup,
  FormLabel,
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
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSalary } from './hooks';

interface AdditionalMoneyPopover {
  setSalaryCb: (salary: number | undefined) => void;
  triggerElement: React.ReactNode;
}

const AdditionalMoneyPopover = ({
  setSalaryCb,
  triggerElement,
}: AdditionalMoneyPopover) => {
  const [isSalaryInvalid, setIsSalaryInvalid] = useState(false);
  const [salary, setSalary] = useState<number | undefined>();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { loading, updateUserSalary } = useSalary(setSalaryCb, onClose);
  const initialFocusRef = React.useRef<any>();

  const handleSalaryValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;
    setSalary(value);
  };

  const handleSalaryUpdate = async () => {
    if (!salary) {
      setIsSalaryInvalid(true);
      return;
    }
    await updateUserSalary(salary);
  };

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
      placement="bottom-end"
      closeOnBlur={false}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>{triggerElement}</PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Box mt={4}>
            <FormLabel>
              Digite o dinheiro extra que você recebeu esse mês
            </FormLabel>
            <NumberInput
              ref={initialFocusRef}
              defaultValue={salary}
              precision={2}
              isInvalid={isSalaryInvalid}
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

export default AdditionalMoneyPopover;
