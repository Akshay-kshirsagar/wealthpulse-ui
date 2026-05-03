export interface PortfolioSummary {
  currentValue: number;
  investedValue: number;
  returns: number;
  returnPercent: number;
}

export interface AssetAllocation {
  assetClass: string;
  value: number;
}

export interface ReturnPoint {
  label: string;
  value: number;
}

export interface ClientPortfolio {
  clientId: string;
  clientName: string;
  value: number;
  riskProfile: string;
}
