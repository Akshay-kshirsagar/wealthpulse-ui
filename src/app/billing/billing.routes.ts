import { Routes } from '@angular/router';

export const billingRoutes: Routes = [
  { path: '', loadComponent: () => import('./billing-dashboard/billing-dashboard').then((m) => m.BillingDashboard) },
  { path: 'invoices', loadComponent: () => import('./invoices-list/invoices-list').then((m) => m.InvoicesList) },
  { path: 'generate', loadComponent: () => import('./generate-invoice/generate-invoice').then((m) => m.GenerateInvoice) },
  { path: 'invoices/:id', loadComponent: () => import('./invoice-details/invoice-details').then((m) => m.InvoiceDetails) }
];
