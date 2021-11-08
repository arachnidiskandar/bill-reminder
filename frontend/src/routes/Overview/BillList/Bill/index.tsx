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
import { MoreOutlined } from '@ant-design/icons';
import useStore, { BillsState } from '../../../../store/useStore';

type BillProps = {
  dueDate: Date;
  billName: string;
  billValue: number;
  id: string;
};
const openModalDeleteSelector = (state: BillsState) => state.openModalDelete;
const openModalEditSelector = (state: BillsState) => state.openModalEdit;
const Bill = ({ dueDate, billName, billValue, id }: BillProps) => {
  const openModalDelete = useStore(openModalDeleteSelector);
  const openModalEdit = useStore(openModalEditSelector);

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
          <Text fontSize="xl" fontWeight="semibold">
            07
          </Text>
          <Text fontSize="sm">Aug</Text>
        </Box>
        <Box w="100%" m="0 8px">
          <Text fontSize="large">{billName}</Text>
          <Text>{`$${billValue}`}</Text>
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
              <MenuItem icon={<EditIcon />} onClick={() => openModalEdit(id)}>
                Editar
              </MenuItem>
              <MenuItem
                icon={<DeleteIcon />}
                onClick={() => openModalDelete(id)}
              >
                Excluir
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
    </>
  );
};

export default Bill;
