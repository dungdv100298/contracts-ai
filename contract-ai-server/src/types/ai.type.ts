export interface IRisk {
  risk: string;
  explanation: string;
}

export interface IOpportunity {
  opportunity: string;
  explanation: string;
}

export interface FallbackAnalysis {
  risks: IRisk[];
  opportunities: IOpportunity[];
  summary: string;
}