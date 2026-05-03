import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../shared/page-header/page-header';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-billing-dashboard',
  imports: [AsyncPipe, CurrencyPipe, PageHeader, RouterLink],
  templateUrl: './billing-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingDashboard {
  private readonly billingService = inject(BillingService);
  protected readonly summary$ = this.billingService.getSummary();
}
