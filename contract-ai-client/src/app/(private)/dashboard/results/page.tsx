"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import { useContractStore } from "@/store/zustand";

export default function ContractResultsPage() {
  const analysisResults = useContractStore((state) => state.analysisResults);

  return (
    <div>
      <ContractAnalysisResults
        analysisResults={analysisResults}
        isActive={true}
        contractId={analysisResults?._id}
        onUpgrade={() => {}}
      />
    </div>
  );
}
