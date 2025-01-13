"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";

type ContractResultsProps = {
  contractId: string;
};

export const ContractResults = ({ contractId }: ContractResultsProps) => {
  const { data: contract, isLoading, error } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => getContractById(contractId),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return notFound();
  
  return (
    <ContractAnalysisResults
      analysisResults={contract}
      isActive={true}
      contractId={contract?._id}
      onUpgrade={() => {}}
    />
  );
};

const getContractById = async (contractId: string) => {
  const response = await api.get(`/contracts/contract/${contractId}`);
  return response.data;
};
