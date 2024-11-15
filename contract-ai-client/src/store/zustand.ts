import { create } from "zustand";

interface IContractStore {
  analysisResults: any;
  setAnalysisResults: (results: any) => void;
}

const useContractStore = create<IContractStore>((set) => ({
  analysisResults: undefined,
  setAnalysisResults: (results) => set({ analysisResults: results }),
}));

export { useContractStore };
