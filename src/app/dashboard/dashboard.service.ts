import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { apiConfig } from '../core/api.config';
import { ChartPoint, DashboardSummary, PortfolioStat } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.gatewayBaseUrl}/dashboard`;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`).pipe(catchError(() => of(mockSummary)));
  }

  getRevenueChart(): Observable<ChartPoint[]> {
    return this.http.get<ChartPoint[]>(`${this.baseUrl}/revenue-chart`).pipe(catchError(() => of(mockRevenue)));
  }

  getClientGrowth(): Observable<ChartPoint[]> {
    return this.http.get<ChartPoint[]>(`${this.baseUrl}/client-growth`).pipe(catchError(() => of(mockGrowth)));
  }

  getPortfolioStats(): Observable<PortfolioStat[]> {
    return this.http.get<PortfolioStat[]>(`${this.baseUrl}/portfolio-stats`).pipe(catchError(() => of(mockStats)));
  }
}

const mockSummary: DashboardSummary = {
  totalClients: 428,
  totalAum: 184250000,
  monthlyRevenue: 486000,
  pendingBills: 37,
  todayPnl: 1284500
};

const mockRevenue: ChartPoint[] = [
  { label: 'Jan', value: 320 },
  { label: 'Feb', value: 360 },
  { label: 'Mar', value: 342 },
  { label: 'Apr', value: 410 },
  { label: 'May', value: 455 },
  { label: 'Jun', value: 486 }
];

const mockGrowth: ChartPoint[] = [
  { label: 'Jan', value: 350 },
  { label: 'Feb', value: 364 },
  { label: 'Mar', value: 382 },
  { label: 'Apr', value: 397 },
  { label: 'May', value: 413 },
  { label: 'Jun', value: 428 }
];

const mockStats: PortfolioStat[] = [
  { label: 'Equity allocation', value: '58%', trend: '+3.2%' },
  { label: 'Debt allocation', value: '24%', trend: '-1.1%' },
  { label: 'Cash buffer', value: '8%', trend: '+0.8%' }
];
