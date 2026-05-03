import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { ToastService } from '../../shared/toast.service';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-invoice-details',
  imports: [AsyncPipe, CurrencyPipe, PageHeader, RouterLink],
  templateUrl: './invoice-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly billingService = inject(BillingService);
  private readonly toastService = inject(ToastService);
  protected readonly invoice$ = this.route.paramMap.pipe(switchMap((params) => this.billingService.getInvoiceById(params.get('id') ?? '')));

  protected markPaid(id: string): void {
    this.billingService.markAsPaid(id).subscribe(() => this.toastService.show('Invoice marked as paid', 'success'));
  }

  protected download(id: string): void {
    this.billingService.downloadPdf(id).subscribe(() => this.toastService.show('PDF download requested', 'info'));
  }
}
