/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

type IContractStore = {
  analysisResults: any;
  setAnalysisResults: (results: any) => void;
};

const useContractStore = create<IContractStore>((set) => ({
  analysisResults: undefined,
  setAnalysisResults: (results) => set({ analysisResults: results }),
}));

type ModalStore = {
  modals: Record<string, boolean>;
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  isOpen: (key: string) => boolean;
};

const useModalStore = create<ModalStore>((set, get) => ({
  modals: {},
  openModal: (key) => set((state) => ({ ...state, modals: { ...state.modals, [key]: true } })),
  closeModal: (key) => set((state) => ({ ...state, modals: { ...state.modals, [key]: false } })),
  isOpen: (key) => Boolean(get().modals[key]),
}));

export { useContractStore, useModalStore };
