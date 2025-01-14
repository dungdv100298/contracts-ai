import { ContractResults } from "./_components/contract-results";

type ContractPageProps = {
  readonly params: Promise<{
    id: string;
  }>;
};

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params;
  return <ContractResults contractId={id} />;
}
