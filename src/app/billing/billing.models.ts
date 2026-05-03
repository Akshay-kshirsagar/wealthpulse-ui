export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface BillingSummary {
  totalInvoices: number;
  paid: number;
  pending: number;
  overdue: number;
  monthlyRevenue: number;
}
