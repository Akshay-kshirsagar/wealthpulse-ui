import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { BillingService } from '../billing.service';
import { Invoice } from '../billing.models';

@Component({
  selector: 'app-invoices-list',
  imports: [AsyncPipe, DataTable, PageHeader, RouterLink],
  templateUrl: './invoices-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesList {
  private readonly billingService = inject(BillingService);
  private readonly router = inject(Router);
  protected readonly invoices$ = this.billingService.getInvoices();
  protected readonly columns: DataTableColumn[] = [
    { key: 'id', label: 'Invoice' },
    { key: 'clientName', label: 'Client' },
    { key: 'amount', label: 'Amount' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status' }
  ];

  protected view(row: unknown): void {
    void this.router.navigate(['/billing/invoices', (row as Invoice).id]);
  }
}
