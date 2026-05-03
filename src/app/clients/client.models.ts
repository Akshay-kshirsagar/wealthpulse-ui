export type RiskProfile = 'Low' | 'Moderate' | 'High';

export interface Client {
  id: string;
  name: string;
  pan: string;
  email: string;
  mobile: string;
  riskProfile: RiskProfile;
  address: string;
  aum: number;
}

export type ClientPayload = Omit<Client, 'id' | 'aum'> & Partial<Pick<Client, 'aum'>>;
