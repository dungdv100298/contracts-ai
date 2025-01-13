import { ContractResults } from "./_components/contract-results";

type ContractPageProps = {
  readonly params: {
    id: string;
  };
};

export default function ContractPage({ params }: ContractPageProps) {
  return <ContractResults contractId={params.id} />;
}
