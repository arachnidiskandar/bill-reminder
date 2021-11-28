import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { DollarOutlined, MoreOutlined } from '@ant-design/icons';
import { getMonthName } from '../../../../../../helpers/DateHelpers';
import useBillsStore, { BillsState } from '../../../billsStore';
import PaymentModal from './PaymentModal';

type BillProps = {
  dueDate: string;
  billName: string;
  billValue: number;
  paymentId: string;
};
const openModalDeleteSelector = (state: BillsState) => state.openModalDelete;
const openModalEditSelector = (state: BillsState) => state.openModalEdit;
const shouldDisablePaymentSelector = (state: BillsState) =>
  state.shouldDisablePayment;
const Bill = ({ dueDate, billName, billValue, paymentId }: BillProps) => {
  const openModalDelete = useBillsStore(openModalDeleteSelector);
  const openModalEdit = useBillsStore(openModalEditSelector);
  const shouldDisablePayment = useBillsStore(shouldDisablePaymentSelector);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  return (
    <>
      <Flex
        my="2"
        borderWidth="1px"
        borderRadius="lg"
        p={2}
        alignItems="center"
      >
        <Box p={2}>
          <Text fontSize="xl" fontWeight="semibold" align="center">
            {new Date(dueDate).getDate()}
          </Text>
          <Text fontSize="sm">{getMonthName(new Date(dueDate), 'short')}</Text>
        </Box>
        <Box w="100%" m="0 8px">
          <Text fontSize="large">{billName}</Text>
          <Text>{`R$ ${billValue}`}</Text>
        </Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<MoreOutlined />}
            variant="outline"
          />
          <Portal>
            <MenuList transform="translate(30px, 100px)" w="100%">
              {!shouldDisablePayment && (
                <MenuItem
                  icon={<DollarOutlined />}
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Pagar
                </MenuItem>
              )}
              <MenuItem
                icon={<EditIcon />}
                onClick={() => openModalEdit(paymentId)}
              >
                Editar
              </MenuItem>
              <MenuItem
                icon={<DeleteIcon />}
                onClick={() => openModalDelete(paymentId)}
              >
                Excluir
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
        <PaymentModal
          paymentId={paymentId}
          isOpen={openPaymentModal}
          onClose={() => setOpenPaymentModal(false)}
        />
      </Flex>
    </>
  );
};

export default Bill;
