import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import usePayBill from './hooks';

interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBillValue?: number;
  paymentId: string;
}
const PaymentModal = ({
  isOpen,
  onClose,
  defaultBillValue,
  paymentId,
}: ModalAlertProps) => {
  const cancelRef = useRef(null);
  const [useDefaultValue, setUseDefaultValue] = useState(true);
  const [billValue, setBillValue] = useState(defaultBillValue);
  const { loading, payBill } = usePayBill();

  const handleBillValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;
    setBillValue(value);
  };

  const handleMarkAsPaid = async () => payBill(paymentId, onClose, billValue);

  useEffect(() => {
    if (useDefaultValue) {
      setBillValue(undefined);
    }
  }, [useDefaultValue]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Pagar conta
          </AlertDialogHeader>

          <AlertDialogBody>
            Você gostária de marcar essa conta como paga?
            <Checkbox
              mt={2}
              checked={useDefaultValue}
              onChange={() => setUseDefaultValue(prev => !prev)}
              defaultIsChecked
            >
              Utilizar valor padrão da conta
            </Checkbox>
            {!useDefaultValue && (
              <Box mt={4}>
                <FormLabel>
                  Digite o valor pago para a conta desse mês
                </FormLabel>
                <NumberInput defaultValue={billValue} precision={2}>
                  <NumberInputField onChange={handleBillValueChange} />
                </NumberInput>
              </Box>
            )}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleMarkAsPaid} ml={3}>
              Pagar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PaymentModal;
