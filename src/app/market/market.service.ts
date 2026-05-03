import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { apiConfig } from '../core/api.config';
import { Holding, IndexQuote, Mover, Order, Position } from './market.models';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.gatewayBaseUrl}/market`;

  getIndices(): Observable<IndexQuote[]> {
    return this.http.get<IndexQuote[]>(`${this.baseUrl}/indices`).pipe(catchError(() => of(mockIndices)));
  }

  getTopGainers(): Observable<Mover[]> {
    return this.http.get<Mover[]>(`${this.baseUrl}/top-gainers`).pipe(catchError(() => of(mockGainers)));
  }

  getTopLosers(): Observable<Mover[]> {
    return this.http.get<Mover[]>(`${this.baseUrl}/top-losers`).pipe(catchError(() => of(mockLosers)));
  }

  getHoldings(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.baseUrl}/holdings`).pipe(catchError(() => of(mockHoldings)));
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`).pipe(catchError(() => of(mockOrders)));
  }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.baseUrl}/positions`).pipe(catchError(() => of(mockPositions)));
  }
}

const mockIndices: IndexQuote[] = [
  { name: 'NIFTY 50', value: 22540.2, change: 0.84 },
  { name: 'SENSEX', value: 74228.1, change: 0.71 }
];
const mockGainers: Mover[] = [
  { symbol: 'TCS', price: 4120, change: 3.8 },
  { symbol: 'INFY', price: 1588, change: 2.6 }
];
const mockLosers: Mover[] = [
  { symbol: 'HDFCBANK', price: 1460, change: -1.4 },
  { symbol: 'ITC', price: 428, change: -0.9 }
];
const mockHoldings: Holding[] = [
  { symbol: 'RELIANCE', qty: 120, avgPrice: 2420, ltp: 2588, pnl: 20160, dayChange: 1.2 },
  { symbol: 'TCS', qty: 80, avgPrice: 3860, ltp: 4120, pnl: 20800, dayChange: 3.8 },
  { symbol: 'HDFCBANK', qty: 140, avgPrice: 1512, ltp: 1460, pnl: -7280, dayChange: -1.4 }
];
const mockOrders: Order[] = [
  { id: 'O-1001', symbol: 'INFY', side: 'Buy', qty: 25, status: 'Executed' },
  { id: 'O-1002', symbol: 'ITC', side: 'Sell', qty: 60, status: 'Pending' }
];
const mockPositions: Position[] = [
  { symbol: 'NIFTY MAY FUT', qty: 50, pnl: 18400 },
  { symbol: 'BANKNIFTY MAY CE', qty: 15, pnl: -5200 }
];
