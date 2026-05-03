import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { apiConfig } from '../core/api.config';
import { AssetAllocation, ClientPortfolio, PortfolioSummary, ReturnPoint } from './portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.gatewayBaseUrl}/portfolio`;

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.baseUrl}/summary`).pipe(catchError(() => of(mockSummary)));
  }

  getAssetAllocation(): Observable<AssetAllocation[]> {
    return this.http.get<AssetAllocation[]>(`${this.baseUrl}/asset-allocation`).pipe(catchError(() => of(mockAllocation)));
  }

  getReturns(): Observable<ReturnPoint[]> {
    return this.http.get<ReturnPoint[]>(`${this.baseUrl}/returns`).pipe(catchError(() => of(mockReturns)));
  }

  getClientPortfolio(clientId: string): Observable<ClientPortfolio> {
    return this.http.get<ClientPortfolio>(`${this.baseUrl}/clients/${clientId}`).pipe(catchError(() => of({ ...mockClientPortfolio, clientId })));
  }
}

const mockSummary: PortfolioSummary = {
  currentValue: 184250000,
  investedValue: 162400000,
  returns: 21850000,
  returnPercent: 13.45
};
const mockAllocation: AssetAllocation[] = [
  { assetClass: 'Equity', value: 58 },
  { assetClass: 'Debt', value: 24 },
  { assetClass: 'Gold', value: 8 },
  { assetClass: 'Cash', value: 10 }
];
const mockReturns: ReturnPoint[] = [
  { label: '1M', value: 2.4 },
  { label: '3M', value: 5.8 },
  { label: '6M', value: 8.6 },
  { label: '1Y', value: 13.45 }
];
const mockClientPortfolio: ClientPortfolio = {
  clientId: 'c-1001',
  clientName: 'Ananya Sharma',
  value: 24500000,
  riskProfile: 'Moderate'
};
