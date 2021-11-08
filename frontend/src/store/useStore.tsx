import create from 'zustand';
import { IBill } from '../interfaces/Bill';

export interface BillsState {
  idToDelete: string;
  billToEdit: IBill | null;
  bills: IBill[];
  setBills: (bills: IBill[]) => void;
  deleteBill: (id: string) => void;
  openModalDelete: (id: string) => void;
  openModalEdit: (id: string) => void;
  closeModalDelete: () => void;
  closeModalEdit: () => void;
}

const useStore = create<BillsState>(set => ({
  idToDelete: '',
  billToEdit: null,
  bills: [],
  setBills: bills => set({ bills }),
  openModalDelete: idToDelete => set({ idToDelete }),
  openModalEdit: id =>
    set(prevState => ({
      billToEdit: prevState.bills.filter(bill => bill.id === id)[0],
    })),
  closeModalDelete: () => set({ idToDelete: '' }),
  closeModalEdit: () => set({ billToEdit: null }),
  deleteBill: id =>
    set(prevState => ({
      bills: prevState.bills.filter(bill => bill.id !== id),
      idToDelete: '',
    })),
}));

export default useStore;
