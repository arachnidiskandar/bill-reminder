import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IBill } from '../../../interfaces/Bill';
import { PaymentBill } from './queries';

export interface BillsState {
  shouldDisablePayment: boolean;
  idToDelete: string;
  paymentBillToEdit: IBill | undefined;
  bills: PaymentBill[];
  setBills: (bills: PaymentBill[]) => void;
  deleteBill: (id: string) => void;
  openModalDelete: (id: string) => void;
  openModalEdit: (id: string) => void;
  closeModalDelete: () => void;
  closeModalEdit: () => void;
  setDisablePayment: (shouldDisabled: boolean) => void;
}

const useBillsStore = create<BillsState>(
  devtools(set => ({
    shouldDisablePayment: false,
    idToDelete: '',
    paymentBillToEdit: undefined,
    bills: [],
    setBills: bills => set({ bills }),
    openModalDelete: idToDelete => set({ idToDelete }),
    openModalEdit: id =>
      set(prevState => ({
        paymentBillToEdit: prevState.bills.find(bill => bill.paymentId === id)
          ?.bill,
      })),
    closeModalDelete: () => set({ idToDelete: '' }),
    closeModalEdit: () => set({ paymentBillToEdit: undefined }),
    deleteBill: id =>
      set(prevState => ({
        bills: prevState.bills.filter(bill => bill.paymentId !== id),
        idToDelete: '',
      })),
    setDisablePayment: shouldDisablePayment => set({ shouldDisablePayment }),
  }))
);

export default useBillsStore;
