import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { apiConfig } from '../core/api.config';
import { BillingSummary, Invoice } from './billing.models';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.gatewayBaseUrl}/billing`;
  private invoices = [...mockInvoices];

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/invoices`).pipe(catchError(() => of(this.invoices)));
  }

  generateInvoice(clientId: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/invoices`, { clientId }).pipe(
      catchError(() => {
        const invoice: Invoice = { id: `inv-${Date.now()}`, clientId, clientName: 'Selected Client', amount: 25000, dueDate: '2026-06-15', status: 'Pending' };
        this.invoices = [invoice, ...this.invoices];
        return of(invoice);
      })
    );
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return this.http.get<Invoice>(`${this.baseUrl}/invoices/${id}`).pipe(catchError(() => of(this.invoices.find((invoice) => invoice.id === id))));
  }

  markAsPaid(id: string): Observable<Invoice | undefined> {
    return this.http.patch<Invoice>(`${this.baseUrl}/invoices/${id}/paid`, {}).pipe(
      catchError(() => {
        this.invoices = this.invoices.map((invoice) => (invoice.id === id ? { ...invoice, status: 'Paid' } : invoice));
        return of(this.invoices.find((invoice) => invoice.id === id));
      })
    );
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/invoices/${id}/pdf`, { responseType: 'blob' }).pipe(catchError(() => of(new Blob([`Invoice ${id}`], { type: 'application/pdf' }))));
  }

  getSummary(): Observable<BillingSummary> {
    return this.getInvoices().pipe(
      map((invoices) => ({
        totalInvoices: invoices.length,
        paid: invoices.filter((invoice) => invoice.status === 'Paid').length,
        pending: invoices.filter((invoice) => invoice.status === 'Pending').length,
        overdue: invoices.filter((invoice) => invoice.status === 'Overdue').length,
        monthlyRevenue: invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
      }))
    );
  }
}

const mockInvoices: Invoice[] = [
  { id: 'INV-1001', clientId: 'c-1001', clientName: 'Ananya Sharma', amount: 42000, dueDate: '2026-05-20', status: 'Paid' },
  { id: 'INV-1002', clientId: 'c-1002', clientName: 'Rohan Mehta', amount: 65000, dueDate: '2026-05-25', status: 'Pending' },
  { id: 'INV-1003', clientId: 'c-1003', clientName: 'Priya Nair', amount: 18000, dueDate: '2026-04-30', status: 'Overdue' }
];
